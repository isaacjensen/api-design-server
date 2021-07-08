const express = require('express');
const app = express();
const port = process.env.port || 8000;

let hashmap = new Map();

app.use(express.json());

app.use((req, res, next) => {
    console.log("== Got a new request:");
    console.log(" -- Method:", req.method);
    console.log(" -- Url:", req.originalUrl);
    next();
});

app.get('/businesses', (req, res, next) => {
    let page = req.query.page || 1; //if no page given, default it to 1
    let list =         [{
        name: 'Taco Vino',
        street_address: '140 NW 14th ST',
        city: 'Corvallis',
        state: 'Oregon',
        zip: 97330,
        phone_number: 4254637422,
        category: 'Restaraunt',
        subcategory: 'Mexican',
        website: 'www.tacovino.com',
        email: 'tacovino@tacovino.com'
    },
    {
        name: 'American Dream',
        street_address: '123 NW Monroe',
        city: 'Corvallis',
        state: 'Oregon',
        zip: 97330,
        phone_number: 4254637422,
        category: 'Restaraunt',
        subcategory: 'Pizza',
        website: 'www.americandream.com',
        email: 'dream@americandream.com'
    },        
    {
        name: 'Chipotle',
        street_address: '140 NW 14th ST',
        city: 'Corvallis',
        state: 'Oregon',
        zip: 97330,
        phone_number: 4254637422,
        category: 'Restaraunt',
        subcategory: 'Mexican',
        website: 'www.chipotle.com',
        email: 'chipotle@chipotle.com'
    }];
    res.status(200).send(list[page]);
});

app.post('/businesses', (req, res, next) => {
    //create a new business via POST
    console.log("== req.body:", req.body);
    if (req.body.name && req.body.street_address && req.body.city && req.body.state && req.body.zip
        && req.body.phone_number && req.body.category && req.body.subcategory) {
        res.status(201).send({
            success: "success! POST request was made and business was added"
        });
    }
    else {
        //required data not in 'body'
        res.status(400).send({
            err: "Request body must include fields: 'name', 'street_address', 'city', 'state', 'zip', 'phone_number', 'category' ,'subcategory' !"
        });
    }
});

app.patch('/businesses/:id', (req, res, next) => {
    //modify business information
    const id = req.params.id;
    if (req.body.name || req.body.street_address || req.body.city || req.body.state || req.body.zip
        || req.body.phone_number || req.body.category || req.body.subcategory) {
        //valid because one of the info is present in body
        res.status(200).send({
            success: "information updated for business " + id
        });
    } else {
        //no info in body present, error
        res.status(400).send({
            err: "must include at least one valid field to update!"
        });
    }

});

app.delete('/businesses/:id', (req, res, next) => {
    //user wants to delete a business
    const id = req.params.id;
    if (id) {
        res.status(204).send({ //check status codes
            success: "business " + id + " has been deleted"
        });
    }
    else {
        res.status(404).send({
            err: "The requested resource does not exist: " + req.originalUrl
        });
    }

});

app.post('/reviews/:id', (req, res, next) => {
    //create a new review for a given business
    console.log("== req.body:", req.body);
    const id = req.params.id;
    if (id && req.body.star && req.body.dollar_sign) {
        //body is validated
        if (!hashmap.has(id)) {
            res.status(201).send({
                success: "successfully added review for business " + id
            });
            hashmap.set(id, true);
        }
        else {
            res.status(403).send({
                err: "user may only add one review per business"
            });
        }
    } else {
        //missing request body params
        res.status(404).send({
            err: "missing required body params. Must have 'star' and 'dollar_sign'. User can only create one review per business"
        });
    }
});


app.delete('/reviews/:id', (req, res, next) => {
    //delete a review for a business
    const id = req.params.id;
    console.log('== id: ', id);
    if (id) {
        res.status(204).send({
            success: 'review deleted for business ' + id
        });
    } else {
        res.status(404).send({
            err: 'error deleteing review, invalid id: ' + id
        })
    }
});

app.patch('/reviews/:id', (req, res, next) => { //
    //update existing review for business 
    const id = req.params.id;
    if (id && (req.body.star || req.body.dollar_sign || req.body.review)) {
        res.status(200).send({
            success: 'successfully updated review for business ' + id
        });
    } else {
        if (!id) {
            //no ID was given
            res.status(400).send({
                err: 'no ID was given, unable to update review'
            });
        } else {
            res.status(400).send({
                err: "no 'star', 'dollar_sign' or 'review' given to update!"
            });
        }
    }
});

app.get('/details/:id', (req, res, next) => {
    //get reviews/photos from businesses
    const id = req.params.id;
    if (id) {
        res.status(200).send([{
            name: 'American Dream',
            street_address: '123 NW Monroe',
            city: 'Corvallis',
            state: 'Oregon',
            zip: 97330,
            phone_number: 4254637422,
            category: 'Restaraunt',
            subcategory: 'Pizza',
            website: 'www.americandream.com',
            email: 'dream@americandream.com'
        }, {
            star: 5,
            dollar_sign: '$$',
            review: 'A great spot for funky tacos!'
        }, {
            photo: {
                url: 'http://google.com/images/2313231231',
                caption: 'A great photo!'
            }
        }
        ]);
    }
    else {
        next();
    }
});

app.post('/:user/photos', (req, res, next) => {
    const user = req.params.user;
    if (user && req.body.photo) {
        res.status(201).send({
            success: "successfully uploaded an image to user: " + user
        });
    }
    else {
        res.status(400).send({
            err: "Request body needs a 'photo' in body and an optional caption."
        });
    }
});

app.delete('/:user/photos/:id', (req, res, next) => {
    const user = req.params.user;
    const id = req.params.id;

    if (user && id) {
        res.status(204).send({
            success: "image has been deleted"
        });
    }
    else {
        res.status(400).send({
            err: "Request body needs a 'user' and an 'id'"
        });
    }
});

app.patch('/:user/photos/:id', (req, res, next) => {
    const user = req.params.user;
    const id = req.params.id;

    if (user && id && req.body.caption) {
        res.status(200).send({
            success: "photo caption has been updated for user: " + user
        });
    }
    else {
        res.status(400).send({
            err: "Request body needs a 'user' and an 'id' as well as a 'caption' in body"
        });
    }
});

app.get('/:user/businesses', (req, res, next) => {
    //list user's businesses
    const user = req.params.user;
    if (user) {
        res.status(200).send({
            name: 'Toms Bar',
            street_address: '123 NW Monroe',
            city: 'Corvallis',
            state: 'Oregon',
            zip: 97330,
            phone_number: 4254637422,
            category: 'Bar',
            subcategory: 'Bar food'
        });
    } else {
        res.status(400).send({
            err: "Request params needs a 'user'"
        });
    }
});

app.get('/:user/reviews', (req, res, next) => {
    //list user's reviews
    const user = req.params.user;
    if (user) {
        res.status(200).send({
            star: 5,
            dollar_sign: '$$',
            review: 'A great spot for good food!'
        });
    } else {
        res.status(400).send({
            err: "Request params needs a 'user'"
        });
    }
});

app.get('/:user/photos', (req, res, next) => {
    const user = req.params.user;
    if (user) {
        res.status(200).send({
            photo: 'condo_photo1.jpg',
            caption: 'A nice condo outlooking the Portland, OR area'
        });
    } else {
        res.status(400).send({
            err: "Request params needs a 'user'"
        });
    }
});


app.use('*', (req, res, next) => {
    res.status(404).send({
        err: "The requested resource does not exist: " + req.originalUrl
    });
});

app.listen(port, () => {
    console.log("===> Server is listening on port", port);
});
