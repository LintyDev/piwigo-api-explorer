const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const qs = require('qs');

const app = express();
const PORT = 5565;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/getData', async (req, res) => {
    var query = req.body.query ? req.body.query.toString() : '';
    var currentPage = req.body.currentPage ? req.body.currentPage.toString() : '';
    var order = req.body.order ? req.body.order.toString() : '';
    try {
        const response = await axios.get('https://demo1.piwigo.com/ws.php', {
            params: {
                format: 'json',
                method: 'pwg.images.search',
                query: query,
                per_page: 16,
                page: currentPage,
                order: order
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ error: 'Error with API, try again !' });
    }
});

// Récupère la liste des tags
app.get('/getTags', async (req, res) => {
    try {
        const response = await axios.get('https://demo1.piwigo.com/ws.php', {
            params: {
                format: 'json',
                method: 'pwg.tags.getList',
                sort_by_counter: true,
            }
        });
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ error: 'Error with API, try again !' });
    }
});

// Récupère les données des images depuis l'id d'un tag
app.post('/getDataByTags', async (req, res) => {
    var tagId = req.body.tagId ? req.body.tagId.map(Number) : [];
    var currentPage = req.body.currentPage ? req.body.currentPage.toString() : '';
    var order = req.body.order ? req.body.order.toString() : '';
    console.log(tagId);
    const fullUrl = `https://demo1.piwigo.com/ws.php?${qs.stringify({
        format: 'json',
        method: 'pwg.tags.getImages',
        'tag_id[]': tagId,
        tag_mode_and: true,
        per_page: 16,
        page: currentPage,
        order: order
    }, { arrayFormat: 'repeat' })}`;
    console.log(fullUrl);
    try {
        const response = await axios.get(fullUrl);
        res.send(response.data);
    } catch (error) {
        res.status(500).send({ error: 'Error with API, try again !' });
    }
});




app.listen(PORT, () => {
    console.log(`Server start on http://localhost:${PORT}`);
});