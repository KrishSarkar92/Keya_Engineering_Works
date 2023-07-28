const express = require('express');
const mariadb = require('mariadb');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { fstat } = require('fs');
const Cheerio = require('cheerio');
const { resolveObjectURL } = require('buffer');
const { createInflate } = require('zlib');
const port = 8000;

const app = express();
dotenv.config();

const pool = mariadb.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWD,
    database: process.env.DB,
    connectionLimit: 5
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const index = path.join(__dirname, 'public', 'index.html');
    res.sendFile(index);
});

/** Choice entry type */
let choice = {};
app.post('/entryChoice', async (req, res) => {

    const { entryChoice } = req.body;
    choice['entryChoice'] = entryChoice;

    /** Database query */
    let conn;
    try {
        conn = await pool.getConnection();
        const company = await conn.query("SELECT GSTIN, Name FROM company");
        const clen = await conn.query("SELECT COUNT(*) AS clen FROM company");
        const purchaseProduct = await conn.query("SELECT Product_Id, Product_Name FROM products");
        const len = await conn.query("SELECT COUNT(*) AS len FROM products");
        const noOfCompany = parseInt(clen[0].clen, 10);
        const noOfProduct = parseInt(len[0].len, 10);

        entryCh(res, company, noOfCompany, purchaseProduct, noOfProduct, choice, '');

    } catch (err) {
        if (err) console.log(err);
    } finally {
        if (conn) conn.end();
    }
});

/** Data entry into purchase database */
app.post('/purchaseEntry', async (req, res) => {
    const { companyPurchaseGst, productId, pdate, price, quantity, gstRate } = req.body;
    choice['companyPurchaseGst'] = companyPurchaseGst;
    console.log(choice);

    /** Maintain state */
    let purchProduct;
    let noProduct;
    let companyN;
    let noOfCompanyN;

    /** Database Entry */
    let conn;
    try {
        conn = await pool.getConnection();
        const company = await conn.query("SELECT GSTIN, Name FROM company");
        //const clen = await conn.query("SELECT COUNT(*) AS clen FROM company");
        const purchaseProduct = await conn.query("SELECT Product_Id, Product_Name FROM products");
        //const len = await conn.query("SELECT COUNT(*) AS len FROM products");
        const noOfCompany = company.length;
        const noOfProduct = purchaseProduct.length; // parseInt(len[0].len, 10);

        purchProduct = purchaseProduct;
        noProduct = noOfProduct;
        companyN = company;
        noOfCompanyN = noOfCompany;
        if (pdate === "")
            await conn.query("INSERT INTO purchase(GSTIN, Product_Id, Price, Quantity, gst_perc) values(?, ?, ?, ?, ?)", [companyPurchaseGst, productId, price, quantity, gstRate]);
        else
            await conn.query("INSERT INTO purchase(GSTIN, Product_Id, Date, Price, Quantity, gst_perc) values(?, ?, ?, ?, ?, ?)", [companyPurchaseGst, productId, pdate, price, quantity, gstRate]);

        entryCh(res, company, noOfCompany, purchaseProduct, noOfProduct, choice, 'success');

    } catch (err) {
        if (err) console.log(err);
        entryCh(res, companyN, noOfCompanyN, purchProduct, noProduct, choice, 'error');
    } finally {
        if (conn) conn.end();
    }
});

/** Data entry into sale database */
app.post('/saleEntry', async (req, res) => {
    const { companySaleGst, productId, sdate, price, quantity, gstRate } = req.body;
    choice['companySaleGst'] = companySaleGst;

    /** Maintain state */
    let purchProduct;
    let noProduct;
    let companyN;
    let noOfCompanyN;

    /** Database Entry */
    let conn;
    try {
        conn = await pool.getConnection();
        const company = await conn.query("SELECT GSTIN, Name FROM company");
        // const clen = await conn.query("SELECT COUNT(*) AS clen FROM company");
        const purchaseProduct = await conn.query("SELECT Product_Id, Product_Name FROM products");
        // const len = await conn.query("SELECT COUNT(*) AS len FROM products");
        const noOfCompany = company.length; //parseInt(clen[0].clen, 10);
        const noOfProduct = purchaseProduct.length; // parseInt(len[0].len, 10);

        purchProduct = purchaseProduct;
        noProduct = noOfProduct;
        companyN = company;
        noOfCompanyN = noOfCompany;

        if (sdate === "")
            await conn.query("INSERT INTO sale(GSTIN, Product_Id, Price, Quantity, gst_perc) values(?, ?, ?, ?, ?)", [companySaleGst, productId, price, quantity, gstRate]);
        else
            await conn.query("INSERT INTO sale(GSTIN, Product_Id, Date, Price, Quantity, gst_perc) values(?, ?, ?, ?, ?, ?)", [companySaleGst, productId, sdate, price, quantity, gstRate]);

        entryCh(res, company, noOfCompany, purchaseProduct, noOfProduct, choice, 'success');

    } catch (err) {
        if (err) console.log(err);
        entryCh(res, companyN, noOfCompanyN, purchProduct, noProduct, choice, 'error');
    } finally {
        if (conn) conn.end();
    }
});

app.post('/saleBillEntry', async (req, res) => {
    const { companySaleBillGst, productId, sbdate, price, quantity, gstRate } = req.body;
    choice['companySaleBillGst'] = companySaleBillGst;
    /** Maintain state */
    let purchProduct;
    let noProduct;
    let companyN;
    let noOfCompanyN;

    /** Database Entry */
    let conn;
    try {
        conn = await pool.getConnection();
        const company = await conn.query("SELECT GSTIN, Name FROM company");
        // const clen = await conn.query("SELECT COUNT(*) AS clen FROM company");
        const purchaseProduct = await conn.query("SELECT Product_Id, Product_Name FROM products");
        // const len = await conn.query("SELECT COUNT(*) AS len FROM products");
        const noOfCompany = company.length; // parseInt(clen[0].clen, 10);
        const noOfProduct = purchaseProduct.length; // parseInt(len[0].len, 10);

        purchProduct = purchaseProduct;
        noProduct = noOfProduct;
        companyN = company;
        noOfCompanyN = noOfCompany;

        if (sbdate === "")
            await conn.query("INSERT INTO sale_bill(GSTIN, Product_Id, Price, Quantity, gst_perc) VALUES(?, ?, ?, ?, ?)", [companySaleBillGst, productId, price, quantity, gstRate]);
        else
            await conn.query("INSERT INTO sale_bill(GSTIN, Product_Id, BillDate, Price, Quantity, gst_perc) VALUES(?, ?, ?, ?, ?, ?)", [companySaleBillGst, productId, sbdate, price, quantity, gstRate]);

        entryCh(res, company, noOfCompany, purchaseProduct, noOfProduct, choice, 'success');


    } catch (err) {
        if (err) console.log(err);
        entryCh(res, companyN, noOfCompanyN, purchProduct, noProduct, choice, 'error');
    } finally {
        if (conn) conn.end();
    }
});

app.post('/deliveryEntry', async (req, res) => {
    const { companyId, invoiceNo, challanNo, orderNo } = req.body;

    /** Maintain state */
    let purchProduct;
    let noProduct;
    let companyN;
    let noOfCompanyN;

    /** Database Entry */
    let conn;
    try {
        conn = await pool.getConnection();
        const company = await conn.query("SELECT GSTIN, Name FROM company");
        const clen = await conn.query("SELECT COUNT(*) AS clen FROM company");
        const purchaseProduct = await conn.query("SELECT Product_Id, Product_Name FROM products");
        const len = await conn.query("SELECT COUNT(*) AS len FROM products");
        const noOfCompany = parseInt(clen[0].clen, 10);
        const noOfProduct = parseInt(len[0].len, 10);

        purchProduct = purchaseProduct;
        noProduct = noOfProduct;
        companyN = company;
        noOfCompanyN = noOfCompany;

        await conn.query("INSERT INTO delivery(GSTIN, Invoice_No, Challan_No, Order_No) VALUES(?, ?, ?, ?)", [companyId, invoiceNo, challanNo, orderNo]);

        entryCh(res, company, noOfCompany, purchaseProduct, noOfProduct, choice, 'success');
    } catch (err) {
        if (err) console.log(err);
        entryCh(res, companyN, noOfCompanyN, purchProduct, noProduct, choice, 'error');
    } finally {
        if (conn) conn.end();
    }
});

app.post('/productsEntry', async (req, res) => {
    const { productId, productName } = req.body;

    /** Maintain state */
    let purchProduct;
    let noProduct;
    let companyN;
    let noOfCompanyN;

    /** Database Entry */
    let conn;
    try {
        conn = await pool.getConnection();
        const company = await conn.query("SELECT GSTIN, Name FROM company");
        const purchaseProduct = await conn.query("SELECT Product_Id, Product_Name FROM products");
        const clen = await conn.query("SELECT COUNT(*) AS clen FROM company");
        const len = await conn.query("SELECT COUNT(*) AS len FROM products");
        const noOfCompany = parseInt(clen[0].clen, 10);
        const noOfProduct = parseInt(len[0].len, 10);

        purchProduct = purchaseProduct;
        noProduct = noOfProduct;
        companyN = company;
        noOfCompanyN = noOfCompany;

        if (productId === '' || productName === '') {
            console.log("Must not be blank.");
            throw ("Blank entry");
        } else
            await conn.query("INSERT INTO products(Product_Id, Product_Name) values(?, ?)", [productId, productName]);

        entryCh(res, company, noOfCompany, purchaseProduct, noOfProduct, choice, 'success');
    } catch (err) {
        if (err) console.log(err);
        entryCh(res, companyN, noOfCompanyN, purchProduct, noProduct, choice, 'error');
    } finally {
        if (conn) conn.end();
    }
});

app.post('/generateBill', async (req, res) => {
    const index = path.join(__dirname, "public", "index.html");
    const { billType } = req.body;

    let conn;
    try {
        conn = await pool.getConnection();
        const company = await conn.query("SELECT GSTIN, Name FROM company");
        const len = await conn.query("SELECT COUNT(*) as len FROM company");
        const noOfCompany = parseInt(len[0].len, 10);

        fs.readFile(index, 'utf-8', (err, data) => {
            if (err) console.log(err);

            const $ = Cheerio.load(data);

            if (billType === "dailyBill") {
                $('#generateDailyBill').attr('style', 'display: block;');
                for (let i = 0; i < noOfCompany; i++) {
                    $('#gstnumber').append(`<option value="${company[i].GSTIN}">${company[i].GSTIN}</option>`);
                    $('#cnamed').append(`<option value="${company[i].Name}">${company[i].Name}</option>`);
                }
            } else if (billType === "monthlyBill") {
                $('#generateMonthlyBill').attr('style', 'display: block;');
                for (let i = 0; i < noOfCompany; i++) {
                    $('#cnamem').append(`<option value="${company[i].Name}">${company[i].Name}</option>`);
                }
            }

            data = $.html();
            res.send(data);

        });
    } catch (err) {
        if (err) console.log(err);
        res.redirect('/');
    } finally {
        if (conn) conn.end();
    }
});

app.post('/printDailyBill', async (req, res) => {
    const billPage = path.join(__dirname, 'public', 'dailyBill.html');
    const { database_type, billDate, gstnumber, cname, gstRate } = req.body

    // Woner company gst.
    const wgstin = "19ANLPS7995J1ZR";

    // Calculate current date
    let date_time = new Date();
    let date = ("0" + date_time.getDate()).slice(-2);
    let month = ("0" + (date_time.getMonth() + 1)).slice(-2);
    let year = date_time.getFullYear();
    const curdate = date + '-' + month + '-' + year;
    //console.log(curdate);

    let conn;
    try {
        conn = await pool.getConnection();
        const wcname = await conn.query("SELECT * FROM company where GSTIN = ?", [wgstin]);
        const company_details = await conn.query("SELECT company.GSTIN, Name, Mobile, Email, State, City, PIN, Street FROM company INNER JOIN address ON company.GSTIN=address.GSTIN WHERE company.GSTIN=?", [gstnumber]);
        const product_details = await conn.query(`SELECT ${database_type}.Product_Id, Product_Name, Price, Quantity FROM products INNER JOIN ${database_type} ON products.Product_Id=${database_type}.Product_Id WHERE BillDate=?`, [billDate]);

        // Read bill page and send information to the page.
        fs.readFile(billPage, 'utf-8', (err, data) => {
            if (err) console.log(err);

            const $ = Cheerio.load(data);

            $('#wgstid').text(wgstin);
            $('#wmobile').text(wcname[0].Mobile);
            $('#wemail').text(wcname[0].Email);
            $('#mrs').text(cname);
            $('#bgstid').text(gstnumber);
            $('#state').text(company_details[0].State);


            data = $.html();
            res.send(data);
        });
    } catch (err) {
        if (err) console.log(err);
        res.redirect('/');
    } finally {
        if (conn) conn.end();
    }
});

/**
 * Monthly bill generation...
 */
app.post('/printMonthlyBill', async (req, res) => {
    const monthlyBill = path.join(__dirname, 'public', 'monthlyBill.html');
    const { database_type, cname, dateFrom, dateTo, gst_rate } = req.body;
    let conn;
    try {
        conn = await pool.getConnection();
        const products = await conn.query(`SELECT company.GSTIN, company.Name, ${database_type}.Product_Id, Product_Name, BillDate, Price, Quantity, Invoice_No
            FROM ${database_type} INNER JOIN products on ${database_type}.Product_Id = products.Product_ID
            INNER JOIN company ON company.GSTIN=${database_type}.GSTIN INNER JOIN delivery ON delivery.GSTIN=${database_type}.GSTIN
            WHERE ${database_type}.BillDate between ? AND ? AND company.Name=?`,
            [dateFrom, dateTo, cname]);

        const len = products.length;
        // console.log(products, len);

        fs.readFile(monthlyBill, 'utf8', (err, data) => {
            if (err) console.log(err);

            const $ = Cheerio.load(data);

            $('#companyName').text(cname);
            $('#date-from').text(dateFrom);
            $('#date-to').text(dateTo);

            /**
             * Fill up rows up to 31.
             */
            let totalSum = 0;
            if (len < 31)
                for (let i = 0; i < len; i++) {
                    $(`#row${i + 1} > td:nth-child(1)`).text(i + 1);
                    $(`#row${i + 1} > td:nth-child(2)`).text((products[i].BillDate).toLocaleDateString());
                    $(`#row${i + 1} > td:nth-child(3)`).text(products[i].Invoice_No);
                    $(`#row${i + 1} > td:nth-child(4)`).text(products[i].Product_Name);
                    $(`#row${i + 1} > td:nth-child(5)`).text(products[i].Quantity);
                    $(`#row${i + 1} > td:nth-child(6)`).text("₹ " + products[i].Price);

                    let total = products[i].Quantity * products[i].Price;
                    $(`#row${i + 1} > td:nth-child(7)`).text("₹ " + parseFloat(total).toFixed(2));
                    totalSum += total;
                }
            else
                for (let i = 0; i < 31; i++) {
                    $(`#row${i + 1} > td:nth-child(1)`).text(i + 1);
                    $(`#row${i + 1} > td:nth-child(2)`).text((products[i].BillDate).toLocaleDateString());
                    $(`#row${i + 1} > td:nth-child(3)`).text(products[i].Invoice_No);
                    $(`#row${i + 1} > td:nth-child(4)`).text(products[i].Product_Name);
                    $(`#row${i + 1} > td:nth-child(5)`).text(products[i].Quantity);
                    $(`#row${i + 1} > td:nth-child(6)`).text("₹ " + products[i].Price);

                    let total = products[i].Quantity * products[i].Price;
                    $(`#row${i + 1} > td:nth-child(7)`).text("₹ " + parseFloat(total).toFixed(2));
                    totalSum += total;
                }

            $('#sub-total').text("₹ " + parseFloat(totalSum).toFixed(2));
            $('#gst-rate').text(gst_rate + " %");
            const gstPrice = totalSum * gst_rate / 100.0;
            $('#gst').text("₹ " + parseFloat(gstPrice).toFixed(2));
            const totalPrice = totalSum + gstPrice;
            $('#total').text("₹ " + parseFloat(totalPrice).toFixed(2));

            data = $.html();
            res.send(data);
        });
    } catch (err) {
        if (err) console.log(err);
        res.redirect('/');
    } finally {
        if (conn) conn.end();
    }
})

// Function for entry choice
function entryCh(res, company, noOfCompany, purchaseProduct, noOfProduct, choice, notifyState) {
    const index = path.join(__dirname, 'public', 'index.html');
    fs.readFile(index, 'utf-8', (err, data) => {
        if (err) console.log(err);

        const $ = Cheerio.load(data);

        /** Toast Notification */
        console.log("notify=", notifyState);
        if (notifyState === 'success') {
            $('#toastNotify').attr('value', 'success');
        } else if (notifyState === 'error') {
            $('#toastNotify').attr('value', 'error');
        } else {
            $('#toastNotify').attr('value', '');
        }

        /**
         * For purchase entry.
         */
        if (choice.entryChoice === 'purchase') {
            for (let i = 0; i < noOfCompany; i++) {
                $('#companyPurchaseGst').append(`<option value="${company[i].GSTIN}">${company[i].Name + " - " + company[i].GSTIN}</option>`);
            }
            for (let plen = 0; plen < noOfProduct; plen++) {
                $('#purchase').append(`<option value="${purchaseProduct[plen].Product_Id}" name="ProductId">${purchaseProduct[plen].Product_Name} - ${purchaseProduct[plen].Product_Id}</option>`);
            }
            $('#companyPurchaseGst').val(choice.companyPurchaseGst);
            $('#entryChoice').val(choice.entryChoice);
            $('#saleSelected').attr('value', '');
            $('#saleBillSelected').attr('value', '');
            $('#deliverySelected').attr('value', '');
            $('#purchaseSelected').attr('value', 'true');
            $('#productsSelected').attr('value', '');

            /**
             * For sale entry.
             */
        } else if (choice.entryChoice === 'sale') {
            for (let i = 0; i < noOfCompany; i++) {
                $('#companySaleGst').append(`<option value="${company[i].GSTIN}">${company[i].Name + " - " + company[i].GSTIN}</option>`);
            }
            for (let plen = 0; plen < noOfProduct; plen++) {
                $('#saleId').append(`<option value="${purchaseProduct[plen].Product_Id}" name="ProductId">${purchaseProduct[plen].Product_Name} - ${purchaseProduct[plen].Product_Id}</option>`);
            }
            $('#companySaleGst').val(choice.companySaleGst);
            $('#entryChoice').val(choice.entryChoice);
            $('#purchaseSelected').attr('value', '');
            $('#saleBillSelected').attr('value', '');
            $('#deliverySelected').attr('value', '');
            $('#saleSelected').attr('value', 'true');
            $('#productsSelected').attr('value', '');

            /**
             * For sale bill entry
             */
        } else if (choice.entryChoice === 'saleBill') {
            for (let i = 0; i < noOfCompany; i++) {
                $('#companySaleBillGst').append(`<option value="${company[i].GSTIN}">${company[i].Name + " - " + company[i].GSTIN}</option>`);
            }
            for (let plen = 0; plen < noOfProduct; plen++) {
                $('#saleBillId').append(`<option value="${purchaseProduct[plen].Product_Id}" name="ProductId">${purchaseProduct[plen].Product_Name} - ${purchaseProduct[plen].Product_Id}</option>`);
            }
            $('#companySaleBillGst').val(choice.companySaleBillGst);
            $('#entryChoice').val(choice.entryChoice);
            $('#purchaseSeleted').attr('value', '');
            $('#saleSelected').attr('value', '');
            $('#deliverySelected').attr('value', '');
            $('#saleBillSelected').attr('value', 'true');
            $('#productsSelected').attr('value', '');


            /**
             * For delivery entry.
             */
        } else if (choice.entryChoice === 'delivery') {
            for (let i = 0; i < noOfCompany; i++) {
                $('#companyId').append(`<option value="${company[i].GSTIN}">${company[i].Name + " - " + company[i].GSTIN}</option>`);
            }
            $('#entryChoice').val(choice.entryChoice);
            $('#saleBillSelected').attr('value', '');
            $('#purchaseSeleted').attr('value', '');
            $('#saleSelected').attr('value', '');
            $('#deliverySelected').attr('value', 'true');
            $('#productsSelected').attr('value', '');

            /**
             * For products entry
             */
        } else if (choice.entryChoice === 'products') {
            $('#productsSelected').attr('value', 'true');
            $('#purchaseSeleted').attr('value', '');
            $('#saleSelected').attr('value', '');
            $('#saleBillSelected').attr('value', '');
            $('#deliverySelected').attr('value', '');
            $('#entryChoice').val(choice.entryChoice);
        }

        data = $.html();
        res.send(data);
    });
}


app.listen(port, () => {
    console.log("Connect at port: ", port);
});