const csv = require('csvtojson');
const path = require('path');

async function getProvinsi(req, res, next) {
    const db_provinsi = path.resolve(__dirname, './data/provinces.csv');
    try {
        const data = await csv().fromFile(db_provinsi);
        return res.json(data);
    } catch (error) {
        return res.json({
            error: 1,
            message: 'Tidak bisa mengambil data provinsi'
        })
    }
}

async function getKabupaten(req, res, next) {
    const db_kabupaten = path.resolve(__dirname, './data/regencies.csv');
    console.log(db_kabupaten);

    try {
        let { kode_induk } = req.query;
        const data = await csv().fromFile(db_kabupaten);
        console.log("data");
        if (!kode_induk) return res.json(data);

        return res.json(data.filter(kabupaten => kabupaten.kode_provinsi === kode_induk));
    } catch (err) {
        return res.json({
            error: 1,
            message: 'Tidak bisa mengambil data kabupaten'
        });
    }
}

async function getKecamatan(req, res, next) {
    const db_kecamatan = path.resolve(__dirname, './data/districts.csv');
    console.log(db_kecamatan);

    try {
        let { kode_induk } = req.query;
        const data = await csv().fromFile(db_kecamatan);

        if (!kode_induk) return res.json(data);

        return res.json(data.filter(kecamatan => kecamatan.kode_kabupaten === kode_induk));
    } catch (err) {
        return res.json({
            error: 1,
            message: 'Tidak bisa mengambil data kabupaten'
        });
    }
}

async function getDesa(req, res, next) {
    const db_desa = path.resolve(__dirname, './data/villages.csv');

    try {
        let { kode_induk } = req.query;
        const data = await csv().fromFile(db_desa);

        if (!kode_induk) return res.json(data);

        return res.json(data.filter(desa => desa.kode_kabupaten === kode_induk));
    } catch (err) {
        return res.json({
            error: 1,
            message: 'Tidak bisa mengambil data kabupaten'
        });
    }
}

module.exports = {
    getProvinsi,
    getKabupaten,
    getKecamatan,
    getDesa
}