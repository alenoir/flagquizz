import SQLite from 'react-native-sqlite-storage';
import moment from 'moment';
import {
  SearchFinanceTypes,
  SearchResidualValueTypes,
  SearchVehicleTypes,
} from '../constants';

function errorCB(err) {
  console.log(`SQL Error: ${err}`);
}

function successCB() {
  console.log('SQL executed fine');
}

function openCB() {
  console.log('Database OPENED');
}

const db = SQLite.openDatabase('database.db', '1.0', 'GMFinance', 200000, openCB, errorCB);

function batchQueries(queries) {
  return new Promise((resolve, reject) => {
    if (queries.length) {
      db.sqlBatch(queries, () => {
        // setTimeout(() => {
        resolve();
        // }, 500);
      }, (error) => {
        reject(`SQL batch ERROR: ${error.message}`);
      });
    } else {
      resolve();
    }
  });
}

function parseSearch(search) {
  let whereSQL = ' WHERE ';
  const arrayWhere = [];
  const params = [];
  if (search.vehicleType) {
    if (search.vehicleType === SearchVehicleTypes.used) {
      arrayWhere.push(' (vehicleType LIKE ? or vehicleType LIKE ?)');
      params.push(`%${SearchVehicleTypes.new}%`);
      params.push(`%${SearchVehicleTypes.used}%`);
    } else {
      arrayWhere.push(' vehicleType LIKE ?');
      params.push(`%${search.vehicleType}%`);
    }
  }

  if (search.vehicleCategory) {
    arrayWhere.push(' category = ?');
    params.push(search.vehicleCategory);
  }

  if (search.brand) {
    arrayWhere.push(' brand = ?');
    params.push(search.brand);
  }

  if (search.model) {
    arrayWhere.push(' family = ?');
    params.push(search.model);
  }

  if (search.energy) {
    arrayWhere.push(' energy = ?');
    params.push(search.energy);
  }

  if (search.finishes) {
    arrayWhere.push(' finishes = ?');
    params.push(search.finishes);
  }

  if (search.modelYear) {
    arrayWhere.push(' year = ?');
    params.push(parseInt(search.modelYear, 10));
  }

  if (search.version) {
    arrayWhere.push(' commercialLabel = ?');
    params.push(search.version);
  }

  if (arrayWhere.length > 0) {
    whereSQL += arrayWhere.join(' AND ');
    return { whereSQL, params };
  }
  return { whereSQL: null, params: null };
}

/* ================== */
/*  Cars
/* ================== */

export function resetCars() {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    const queries = [];

    queries.push('DROP TABLE IF EXISTS car');
    queries.push('CREATE TABLE IF NOT EXISTS car(id,year,category,brand,model,family,generation,finishes,commercialLabel,energy,cvF,co2,bonusMalus,priceDate,priceTTC,modelYear,vehicleType)');

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function saveCars(objects) {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    let queries = [];
    let count = 0;

    objects.forEach((object) => {
      const keys = Object.keys(object);
      const values = Object.values(object);
      const keysString = keys.join(',');
      const valuesString = values.map(() => '?');
      queries.push([`insert into car(${keysString})values(${valuesString});'`, values]);
      count += 1;

      if (count % 1000 === 0) {
        groupsQueries.push(queries);
        queries = [];
      }
    });

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}


export function findCars(search) {
  const { whereSQL, params } = parseSearch(search);
  let sql = 'SELECT * FROM car ';
  if (whereSQL) {
    sql += whereSQL;
  }

  return new Promise((resolve) => {
    db.executeSql(sql, params, (results) => {
      resolve(results.rows.raw());
    }, (error) => {
      resolve([]);
    });
  });
}

export function findBrandsCars(search) {
  const { whereSQL, params } = parseSearch(search);
  let sql = 'SELECT brand FROM car ';
  if (whereSQL) {
    sql += whereSQL;
  }
  sql += ' GROUP BY brand';

  return new Promise((resolve) => {
    db.executeSql(sql, params, (results) => {
      const brands = results.rows.raw().filter((row) => typeof row.brand === 'string').map((row) => row.brand);
      resolve(brands);
    }, (error) => {
      resolve([]);
    });
  });
}

export function findModelsCars(search) {
  const { whereSQL, params } = parseSearch(search);

  let sql = 'SELECT family FROM car ';
  if (whereSQL) {
    sql += whereSQL;
  }
  sql += ' GROUP BY family';
  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (results) => {
      const models = results.rows.raw().filter((row) => typeof row.family === 'string').map((row) => row.family);

      resolve(models);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}

export function findEnergiesCars(search) {
  const { whereSQL, params } = parseSearch(search);

  let sql = 'SELECT energy FROM car ';
  if (whereSQL) {
    sql += whereSQL;
  }
  sql += ' GROUP BY energy';

  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (results) => {
      const energies = results.rows.raw().filter((row) => typeof row.energy === 'string').map((row) => row.energy);

      resolve(energies);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}

export function findFinishesCars(search) {
  const { whereSQL, params } = parseSearch(search);

  let sql = 'SELECT finishes FROM car ';
  if (whereSQL) {
    sql += whereSQL;
  }
  sql += ' GROUP BY finishes';

  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (results) => {
      const finishes = results.rows.raw().filter((row) => typeof row.finishes === 'string').map((row) => row.finishes);

      resolve(finishes);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}

export function findVersionsCars(search) {
  const { whereSQL, params } = parseSearch(search);

  let sql = 'SELECT commercialLabel FROM car ';
  if (whereSQL) {
    sql += whereSQL;
  }
  sql += ' GROUP BY commercialLabel';

  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (results) => {
      const versions = results.rows.raw().filter((row) => typeof row.commercialLabel === 'string').map((row) => row.commercialLabel);

      resolve(versions);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}

export function findModelYearsCars(search) {
  const { whereSQL, params } = parseSearch(search);

  let sql = 'SELECT year FROM car ';
  if (whereSQL) {
    sql += whereSQL;
  }
  sql += ' GROUP BY year';
  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (results) => {
      const modelYears = results.rows.raw().filter((row) => typeof row.year === 'number').map((row) => `${row.year}`);
      resolve(modelYears);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}

/* ================== */
/*  Products
/* ================== */

export function resetProducts() {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    const queries = [];

    queries.push('DROP TABLE IF EXISTS product');
    queries.push('CREATE TABLE IF NOT EXISTS product(id,dateFrom,dateTo,customerType,vehicleType,vehicleCategory,vehicleAgeMin int(11),vehicleAgeMax int(11),mileageMin int(11),mileageMax int(11),termMin int(11),termMax int(11),vapPointMin int(11),vapPointMax int(11),amountFinancedMin int(11),amountFinancedMax int(11),installementdMin int(11),installementMax int(11),financeType,financeVehicleAgeMax int(11),brand,model,nominalRate int(11),flatFee int(11),rvMin int(11),plan,promo,createdAt,updatedAt,FileId,amortissementDuration)');

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function saveProducts(objects) {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    let queries = [];
    let count = 0;

    objects.forEach((object) => {
      const keys = Object.keys(object);
      const values = Object.values(object);
      const keysString = keys.join(',');
      const valuesString = values.map(() => '?');
      queries.push([`insert into product(${keysString})values(${valuesString});'`, values]);
      count += 1;

      if (count % 1000 === 0) {
        groupsQueries.push(queries);
        queries = [];
      }
    });

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function parseProductSearch(search) {
  let whereSQL = ' WHERE ';
  const arrayWhere = [];
  const params = [];
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  arrayWhere.push(' dateFrom <= ?');
  params.push(now.toISOString());

  arrayWhere.push(' dateTo >= ?');
  params.push(now.toISOString());

  if (search.customerType) {
    arrayWhere.push(' customerType LIKE ?');
    params.push(`%${search.customerType}%`);
  }

  if (search.vehicleType) {
    arrayWhere.push(' vehicleType LIKE ?');
    params.push(`%${search.vehicleType}%`);
  }

  if (search.financeType) {
    if (search.financeType === SearchFinanceTypes.LOA || search.financeType === SearchFinanceTypes.creditBail) {
      arrayWhere.push(' (financeType LIKE ? or financeType LIKE ?)');
      params.push(`%${SearchFinanceTypes.LOA}%`);
      params.push(`%${SearchFinanceTypes.creditBail}%`);
    } else {
      arrayWhere.push(' financeType LIKE ?');
      params.push(`%${search.financeType}%`);
    }
  }

  if (search.vehicleCategory) {
    arrayWhere.push(' vehicleCategory LIKE ?');
    params.push(`%${search.vehicleCategory}%`);
  }

  if (search.brand) {
    arrayWhere.push(' (brand LIKE ? OR brand LIKE ?)');
    params.push(`%${search.brand}%`);
    params.push('%ALL%');
  }

  if (search.model) {
    arrayWhere.push(' (model LIKE ? OR model LIKE ?)');
    params.push(`%${search.model}%`);
    params.push('%ALL%');
  }

  if (search.mileage) {
    arrayWhere.push(' (mileageMin <= ? OR mileageMin IS NULL)');
    params.push(search.mileage);
    arrayWhere.push(' (mileageMax >= ? OR mileageMax = 0 OR mileageMax IS NULL)');
    params.push(search.mileage);
  } else {
    arrayWhere.push(' (mileageMin = 0 OR mileageMin IS NULL)');
    arrayWhere.push(' (mileageMax >= 0 OR mileageMax IS NULL)');
  }

  if (search.duration) {
    arrayWhere.push(' (termMin <= ? OR termMin IS NULL)');
    params.push(search.duration);
    arrayWhere.push(' (termMax >= ? OR termMax = 0 OR termMax IS NULL)');
    params.push(search.duration);
  } else {
    arrayWhere.push(' (termMin = 0 OR termMin IS NULL)');
    arrayWhere.push(' (termMax >= 0 OR termMax IS NULL)');
  }

  if (search.capital) {
    arrayWhere.push(' (amountFinancedMin <= ? OR amountFinancedMin IS NULL)');
    params.push(search.capital);
    arrayWhere.push(' (amountFinancedMax >= ? OR amountFinancedMax = 0 OR amountFinancedMax IS NULL)');
    params.push(search.capital);
  } else {
    arrayWhere.push(' (amountFinancedMin = 0 OR amountFinancedMin IS NULL)');
    arrayWhere.push(' (amountFinancedMax >= 0 OR amountFinancedMax IS NULL)');
  }

  if (search.contributionPercent) {
    arrayWhere.push(' (installementdMin <= ? OR installementdMin IS NULL)');
    params.push(search.contributionPercent);
    arrayWhere.push(' (installementMax >= ? OR installementMax = 0 OR installementMax IS NULL)');
    params.push(search.contributionPercent);
  } else {
    arrayWhere.push(' (installementdMin = 0 OR installementdMin IS NULL)');
    arrayWhere.push(' (installementMax >= 0 OR installementMax IS NULL)');
  }

  if (search.residualValue) {
    arrayWhere.push(' (rvMin <= ? OR rvMin IS NULL)');
    params.push(search.residualValuePercent);
  } else {
    arrayWhere.push(' (rvMin = 0 OR rvMin IS NULL)');
  }

  if (search.registrationDate) {
    const momentDate = moment(search.registrationDate);
    const months = moment().diff(momentDate, 'month');

    arrayWhere.push(' (vehicleAgeMin <= ? OR vehicleAgeMin IS NULL)');
    params.push(months);
    arrayWhere.push(' (vehicleAgeMax >= ? OR vehicleAgeMax = 0 OR vehicleAgeMax IS NULL)');
    params.push(months);
  } else {
    arrayWhere.push(' (vehicleAgeMin = 0 OR vehicleAgeMin IS NULL)');
    arrayWhere.push(' (vehicleAgeMax >= 0 OR vehicleAgeMax IS NULL)');
  }

  if (search.registrationDate) {
    const momentDate = moment(search.registrationDate);
    let months = moment().diff(momentDate, 'month');
    months += search.duration || 0;
    arrayWhere.push(' (financeVehicleAgeMax >= ? OR financeVehicleAgeMax = 0 OR financeVehicleAgeMax IS NULL)');
    params.push(months);
  }


  if (arrayWhere.length > 0) {
    whereSQL += arrayWhere.join(' AND ');
    return { whereSQL, params };
  }
  return { whereSQL: null, params: null };
}

export function findProducts(search) {
  const { whereSQL, params } = parseProductSearch(search);
  let sql = 'SELECT * FROM product ';

  if (whereSQL) {
    sql += whereSQL;
  }

  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (result) => {
      const products = result.rows.raw();
      resolve(products);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}

/* ================== */
/*  Insurances
/* ================== */


export function resetInsurances() {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    const queries = [];

    queries.push('DROP TABLE IF EXISTS insurance');
    queries.push('CREATE TABLE IF NOT EXISTS insurance(id,customerType,financeType,category,vapName,orderCredit,orderLoa,active,incompatibility,costType,customerCostVat,customerCost,amountFinancedMin int(11),amountFinancedMax int(11),customerAgeMin int(11),customerAgeMax int(11),companyAgeMin int(11),companyAgeMax int(11),termMin int(11),termMax int(11),brand,model,brandExclude,vehicleAgeMin int(11),vehicleAgeMax int(11),vehicleType,fiscalPowerMin int(11),fiscalPowerMax int(11),mileageMin int(11),mileageMax int(11),annualMileageMin int(11),annualMileageMax int(11),vehicleCSPPriceMin int(11),vehicleCSPPriceMax int(11),products,tiptool,disclaimer,taea,FileId,createdAt,updatedAt)');

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function saveInsurances(objects) {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    let queries = [];
    let count = 0;

    objects.forEach((object) => {
      const keys = Object.keys(object);
      const values = Object.values(object);
      const keysString = keys.join(',');
      const valuesString = values.map(() => '?');
      queries.push([`insert into insurance(${keysString})values(${valuesString});'`, values]);
      count += 1;

      if (count % 1000 === 0) {
        groupsQueries.push(queries);
        queries = [];
      }
    });

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function parseInsuranceSearch(search, vehicle) {
  let whereSQL = ' WHERE ';
  const arrayWhere = [];
  const params = [];

  arrayWhere.push(' active <= ?');
  params.push(1);

  if (search.customerType) {
    arrayWhere.push(' customerType LIKE ?');
    params.push(`%${search.customerType}%`);
  }

  if (search.vehicleType) {
    arrayWhere.push(' vehicleType LIKE ?');
    params.push(`%${search.vehicleType}%`);
  }

  if (search.financeType) {
    if (search.financeType === SearchFinanceTypes.LOA || search.financeType === SearchFinanceTypes.creditBail) {
      arrayWhere.push(' (financeType LIKE ? or financeType LIKE ?)');
      params.push(`%${SearchFinanceTypes.LOA}%`);
      params.push(`%${SearchFinanceTypes.creditBail}%`);
    } else {
      arrayWhere.push(' financeType LIKE ?');
      params.push(`%${search.financeType}%`);
    }
  }

  if (search.capital) {
    arrayWhere.push(' (amountFinancedMin <= ? OR amountFinancedMin IS NULL)');
    params.push(search.capital);
    arrayWhere.push(' (amountFinancedMax >= ? OR amountFinancedMax = 0 OR amountFinancedMax IS NULL)');
    params.push(search.capital);
  } else {
    arrayWhere.push(' (amountFinancedMin = 0 OR amountFinancedMin IS NULL)');
    arrayWhere.push(' (amountFinancedMax >= 0 OR amountFinancedMax IS NULL)');
  }

  if (search.brand) {
    arrayWhere.push(' (brand LIKE ? OR brand LIKE ?)');
    params.push(`%${search.brand}%`);
    params.push('%ALL%');

    arrayWhere.push(' (brandExclude NOT LIKE ? OR brandExclude IS NULL)');
    params.push(`%${search.brand}%`);
  }

  if (search.model) {
    arrayWhere.push(' (model LIKE ? OR model LIKE ?)');
    params.push(`%${search.model}%`);
    params.push('%ALL%');
  }

  if (search.mileage) {
    arrayWhere.push(' (mileageMin <= ? OR mileageMin IS NULL)');
    params.push(search.mileage);
    arrayWhere.push(' (mileageMax >= ? OR mileageMax = 0 OR mileageMax IS NULL)');
    params.push(search.mileage);
  } else {
    arrayWhere.push(' (mileageMin = 0 OR mileageMin IS NULL)');
    arrayWhere.push(' (mileageMax >= 0 OR mileageMax IS NULL)');
  }

  if (search.duration) {
    arrayWhere.push(' (termMin <= ? OR termMin IS NULL)');
    params.push(search.duration);
    arrayWhere.push(' (termMax >= ? OR termMax = 0 OR termMax IS NULL)');
    params.push(search.duration);
  } else {
    arrayWhere.push(' (termMin = 0 OR termMin IS NULL)');
    arrayWhere.push(' (termMax >= 0 OR termMax IS NULL)');
  }

  if (search.annualMileage) {
    arrayWhere.push(' (annualMileageMin <= ? OR annualMileageMin IS NULL)');
    params.push(search.annualMileage);
    arrayWhere.push(' (annualMileageMax >= ? OR annualMileageMax = 0 OR annualMileageMax IS NULL)');
    params.push(search.annualMileage);
  } else {
    arrayWhere.push(' (annualMileageMin = 0 OR annualMileageMin IS NULL)');
    arrayWhere.push(' (annualMileageMax >= 0 OR annualMileageMax IS NULL)');
  }

  if (search.registrationDate) {
    const momentDate = moment(search.registrationDate);
    const month = moment().diff(momentDate, 'month');

    arrayWhere.push(' (vehicleAgeMin <= ? OR vehicleAgeMin IS NULL)');
    params.push(month);
    arrayWhere.push(' (vehicleAgeMax >= ? OR vehicleAgeMax = 0 OR vehicleAgeMax IS NULL)');
    params.push(month);
  }

  if (vehicle) {
    if (vehicle.cvF) {
      arrayWhere.push(' (fiscalPowerMin <= ? OR fiscalPowerMin IS NULL)');
      params.push(vehicle.cvF);
      arrayWhere.push(' (fiscalPowerMax >= ? OR fiscalPowerMax = 0 OR fiscalPowerMax IS NULL)');
      params.push(vehicle.cvF);
    }

    if (vehicle.catalogPriceTTC) {
      arrayWhere.push(' (vehicleCSPPriceMin <= ? OR vehicleCSPPriceMin IS NULL)');
      params.push(vehicle.catalogPriceTTC);
      arrayWhere.push(' (vehicleCSPPriceMax >= ? OR vehicleCSPPriceMax = 0 OR vehicleCSPPriceMax IS NULL)');
      params.push(vehicle.catalogPriceTTC);
    }
  }

  if (arrayWhere.length > 0) {
    whereSQL += arrayWhere.join(' AND ');
    return { whereSQL, params };
  }
  return { whereSQL: null, params: [] };
}

export function findInsurances(search, vehicle) {
  const { whereSQL, params } = parseInsuranceSearch(search, vehicle);
  let sql = 'SELECT * FROM insurance ';
  let sortSQL = '';

  if (search.financeType) {
    if (search.financeType === SearchFinanceTypes.credit) {
      sortSQL = ' ORDER BY orderCredit ';
    } else {
      sortSQL = ' ORDER BY orderLoa ';
    }
  }

  if (whereSQL) {
    sql += whereSQL;
  }

  sql += sortSQL;

  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (result) => {
      const insurances = result.rows.raw();
      resolve(insurances);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}


/* ================== */
/*  Bonus Malus
/* ================== */


export function resetBonusMalus() {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    const queries = [];

    queries.push('DROP TABLE IF EXISTS bonusmalus');
    queries.push('CREATE TABLE IF NOT EXISTS bonusmalus(id,co2From int(11),co2To int(11),type, amount int(11),applicableYear int(11),FileId,createdAt,updatedAt)');

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function saveBonusMalus(objects) {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    let queries = [];
    let count = 0;

    objects.forEach((object) => {
      const keys = Object.keys(object);
      const values = Object.values(object);
      const keysString = keys.join(',');
      const valuesString = values.map(() => '?');
      queries.push([`insert into bonusmalus(${keysString})values(${valuesString});'`, values]);
      count += 1;

      if (count % 1000 === 0) {
        groupsQueries.push(queries);
        queries = [];
      }
    });

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function parseBonusMalusSearch(search, vehicle) {
  let whereSQL = ' WHERE ';
  const arrayWhere = [];
  const params = [];

  if (arrayWhere.length > 0) {
    whereSQL += arrayWhere.join(' AND ');
    return { whereSQL, params };
  }
  return { whereSQL: null, params: [] };
}

export function findBonusMalus(search, vehicle) {
  const { whereSQL, params } = parseBonusMalusSearch(search, vehicle);
  let sql = 'SELECT * FROM bonusmalus ';

  if (whereSQL) {
    sql += whereSQL;
  }

  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (result) => {
      const objects = result.rows.raw();
      resolve(objects);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}

/* ================== */
/*  TVS
/* ================== */


export function resetTvs() {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    const queries = [];

    queries.push('DROP TABLE IF EXISTS tvs');
    queries.push('CREATE TABLE IF NOT EXISTS tvs(id,co2From int(11),co2To int(11), price int(11),applicableYear int(11),FileId,createdAt,updatedAt)');

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function saveTvs(objects) {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    let queries = [];
    let count = 0;

    objects.forEach((object) => {
      const keys = Object.keys(object);
      const values = Object.values(object);
      const keysString = keys.join(',');
      const valuesString = values.map(() => '?');
      queries.push([`insert into tvs(${keysString})values(${valuesString});'`, values]);
      count += 1;

      if (count % 1000 === 0) {
        groupsQueries.push(queries);
        queries = [];
      }
    });

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function parseTvsSearch(search, vehicle) {
  let whereSQL = ' WHERE ';
  const arrayWhere = [];
  const params = [];

  if (arrayWhere.length > 0) {
    whereSQL += arrayWhere.join(' AND ');
    return { whereSQL, params };
  }
  return { whereSQL: null, params: [] };
}

export function findTvs(search, vehicle) {
  const { whereSQL, params } = parseTvsSearch(search, vehicle);
  let sql = 'SELECT * FROM tvs ';

  if (whereSQL) {
    sql += whereSQL;
  }

  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (result) => {
      const objects = result.rows.raw();
      resolve(objects);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}

/* ================== */
/*  TVS Air
/* ================== */


export function resetTvsAir() {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    const queries = [];

    queries.push('DROP TABLE IF EXISTS tvsair');
    queries.push('CREATE TABLE IF NOT EXISTS tvsair(id,energy , price int(11),applicableYear int(11),FileId,createdAt,updatedAt)');

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function saveTvsAir(objects) {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    let queries = [];
    let count = 0;

    objects.forEach((object) => {
      const keys = Object.keys(object);
      const values = Object.values(object);
      const keysString = keys.join(',');
      const valuesString = values.map(() => '?');
      queries.push([`insert into tvsair(${keysString})values(${valuesString});'`, values]);
      count += 1;

      if (count % 1000 === 0) {
        groupsQueries.push(queries);
        queries = [];
      }
    });

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function parseTvsAirSearch(search, vehicle) {
  let whereSQL = ' WHERE ';
  const arrayWhere = [];
  const params = [];

  if (arrayWhere.length > 0) {
    whereSQL += arrayWhere.join(' AND ');
    return { whereSQL, params };
  }
  return { whereSQL: null, params: [] };
}

export function findTvsAir(search, vehicle) {
  const { whereSQL, params } = parseTvsAirSearch(search, vehicle);
  let sql = 'SELECT * FROM tvsair ';

  if (whereSQL) {
    sql += whereSQL;
  }

  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (result) => {
      const objects = result.rows.raw();
      resolve(objects);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}

/* ================== */
/*  Fuel
/* ================== */


export function resetFuel() {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    const queries = [];

    queries.push('DROP TABLE IF EXISTS fuel');
    queries.push('CREATE TABLE IF NOT EXISTS fuel(id, energy, coefCo2 int(11), price int(11),applicableYear int(11),FileId,createdAt,updatedAt)');

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function saveFuel(objects) {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    let queries = [];
    let count = 0;

    objects.forEach((object) => {
      const keys = Object.keys(object);
      const values = Object.values(object);
      const keysString = keys.join(',');
      const valuesString = values.map(() => '?');
      queries.push([`insert into fuel(${keysString})values(${valuesString});'`, values]);
      count += 1;

      if (count % 1000 === 0) {
        groupsQueries.push(queries);
        queries = [];
      }
    });

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function parseFuelSearch(search, vehicle) {
  let whereSQL = ' WHERE ';
  const arrayWhere = [];
  const params = [];

  if (arrayWhere.length > 0) {
    whereSQL += arrayWhere.join(' AND ');
    return { whereSQL, params };
  }
  return { whereSQL: null, params: [] };
}

export function findFuel(search, vehicle) {
  const { whereSQL, params } = parseFuelSearch(search, vehicle);
  let sql = 'SELECT * FROM fuel ';

  if (whereSQL) {
    sql += whereSQL;
  }
  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (result) => {
      const objects = result.rows.raw();
      resolve(objects);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}

/* ================== */
/*  AND
/* ================== */

export function resetAnd() {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    const queries = [];

    queries.push('DROP TABLE IF EXISTS ands');
    queries.push('CREATE TABLE IF NOT EXISTS ands(id, co2From int(11), co2To int(11), amount int(11),applicableYear int(11),FileId,createdAt,updatedAt)');

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function saveAnd(objects) {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    let queries = [];
    let count = 0;

    objects.forEach((object) => {
      const keys = Object.keys(object);
      const values = Object.values(object);
      const keysString = keys.join(',');
      const valuesString = values.map(() => '?');
      queries.push([`insert into ands(${keysString})values(${valuesString});'`, values]);
      count += 1;

      if (count % 1000 === 0) {
        groupsQueries.push(queries);
        queries = [];
      }
    });

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function parseAndSearch(search, vehicle) {
  let whereSQL = ' WHERE ';
  const arrayWhere = [];
  const params = [];

  if (arrayWhere.length > 0) {
    whereSQL += arrayWhere.join(' AND ');
    return { whereSQL, params };
  }
  return { whereSQL: null, params: [] };
}

export function findAnd(search, vehicle) {
  const { whereSQL, params } = parseAndSearch(search, vehicle);
  let sql = 'SELECT * FROM ands ';

  if (whereSQL) {
    sql += whereSQL;
  }

  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (result) => {
      const objects = result.rows.raw();
      resolve(objects);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}


/* ================== */
/*  VR
/* ================== */

export function resetVrs() {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    const queries = [];

    queries.push('DROP TABLE IF EXISTS vrs');
    queries.push('CREATE TABLE IF NOT EXISTS vrs(id, model, fuel,mileageMin int(11), mileageMax int(11), term int(11), percentMax double(11),FileId,createdAt,updatedAt)');

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

export function saveVrs(objects) {
  return new Promise((resolve, reject) => {
    let promise = Promise.resolve();
    const groupsQueries = [];
    let queries = [];
    let count = 0;

    objects.forEach((object) => {
      const keys = Object.keys(object);
      const values = Object.values(object);
      const keysString = keys.join(',');
      const valuesString = values.map(() => '?');
      queries.push([`insert into vrs(${keysString})values(${valuesString});'`, values]);
      count += 1;

      if (count % 1000 === 0) {
        groupsQueries.push(queries);
        queries = [];
      }
    });

    groupsQueries.push(queries);

    groupsQueries.forEach((groupQueries) => {
      promise = promise.then(() => batchQueries(groupQueries));
    });

    promise.then(() => {
      resolve();
    })
    .catch((err) => {
      reject(err);
    });
  });
}

function parseVrSearch(search, vehicle) {
  let whereSQL = ' WHERE ';
  const arrayWhere = [];
  const params = [];

  if (vehicle.family) {
    arrayWhere.push(' model LIKE ?');
    params.push(vehicle.family);
  }

  if (vehicle.energy) {
    arrayWhere.push(' fuel LIKE ?');
    params.push(`%${vehicle.energy}%`);
  }

  if (search.annualMileage) {
    arrayWhere.push(' (mileageMin <= ? OR mileageMin IS NULL)');
    params.push(search.annualMileage);
    arrayWhere.push(' (mileageMax >= ? OR mileageMax = 0 OR mileageMax IS NULL)');
    params.push(search.annualMileage);
  } else {
    arrayWhere.push(' (mileageMin = 0 OR mileageMin IS NULL)');
    arrayWhere.push(' (mileageMax >= 0 OR mileageMax IS NULL)');
  }

  if (search.duration) {
    arrayWhere.push(' term = ?');
    params.push(`${search.duration}`);
  }

  if (arrayWhere.length > 0) {
    whereSQL += arrayWhere.join(' AND ');
    return { whereSQL, params };
  }
  return { whereSQL: null, params: [] };
}

export function findVrs(search, vehicle) {
  const { whereSQL, params } = parseVrSearch(search, vehicle);
  let sql = 'SELECT * FROM vrs ';

  if (whereSQL) {
    sql += whereSQL;
  }
  return new Promise((resolve, reject) => {
    db.executeSql(sql, params, (result) => {
      const objects = result.rows.raw();
      resolve(objects);
    }, (error) => {
      reject(`SELECT SQL statement ERROR: ${error.message}`);
    });
  });
}
