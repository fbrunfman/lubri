const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const MongoClient = require('mongodb').MongoClient
var mongoose = require('mongoose');
const app = express();
const nodemailer = require("nodemailer");

app.use(express.json());
dotenv.config({ path: './config/config.env' });

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/lubri', { useNewUrlParser: true, useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));



var datosSchema = new mongoose.Schema({

  marca: [String],
  modelo: [Object],
  motor: [String],
  aceite: [String],
  marcaAceite: [String],
  id: Number
  
});

var Datos = mongoose.model('Datos', datosSchema);



db.once('open', function () {
  app.route('api/cargar-datos').post(function (req, res) {

    const datos = new Datos({
      id: 1
    })

    datos.save(function (err) {
      if (err) {
        console.log(err);
        return;
      }

      res.json({ data: datos });
    });
  })

  app.route('/api/datos').get(async (req, res, next) => {
    try {
      let datos = await Datos.findOne({ id: 1 })
      res.json({ status: 200, datos });
    } catch (err) {
      next(err)
    }
  })

  app.route('/api/agregar-marca').put(async (req, res, next) => {
    try {
      let datos = await Datos.findOneAndUpdate({ id: 1 }, {
        $push: {
          marca: req.body.marca
        }
      }, { new: true })
      res.json({ status: 200, datos });
    } catch (err) {
      next(err)
    }
  });
  app.route('/api/agregar-modelo').put(async (req, res, next) => {
    try {
      let datos = await Datos.findOneAndUpdate({ id: 1 }, {
        $push: {
          modelo: {
            name: req.body.modelo,
            marca: req.body.marca
          },
        }
      }, { new: true })
      res.json({ status: 200, datos });
    } catch (err) {
      next(err)
    }
  });
  app.route('/api/agregar-motor').put(async (req, res, next) => {
    try {
      let datos = await Datos.findOneAndUpdate({ id: 1 }, {
        $push: {
          motor: req.body.motor
        }
      }, { new: true })
      res.json({ status: 200, datos });
    } catch (err) {
      next(err)
    }
  });
  app.route('/api/agregar-aceite').put(async (req, res, next) => {
    try {
      let datos = await Datos.findOneAndUpdate({ id: 1 }, {
        $push: {
          aceite: req.body.aceite
        }
      }, { new: true })
      res.json({ status: 200, datos });
    } catch (err) {
      next(err)
    }
  });
  app.route('/api/agregar-marcaAceite').put(async (req, res, next) => {
    try {
      let datos = await Datos.findOneAndUpdate({ id: 1 }, {
        $push: {
          marcaAceite: req.body.marcaAceite
        }
      }, { new: true })
      res.json({ status: 200, datos });
    } catch (err) {
      next(err)
    }
  });

  app.route('/api/borrar-marca').put(async (req, res, next) => {
    try {
      let datos = await Datos.findOneAndUpdate({ id: 1 }, {
        $pull: { marca: req.body.marca, modelo: { marca : req.body.marca}}
      }, { new: true })
      console.log(datos)
      res.json({ status: 200, datos });
    } catch (err) {
      next(err)
    }
  })
  app.route('/api/borrar-modelo').put(async (req, res, next) => {
    try {
      let datos = await Datos.findOneAndUpdate({ id: 1 }, {
        $pull: { modelo: {name: req.body.name} }

      }, { new: true })
      res.json({ status: 200, datos });
    } catch (err) {
      next(err)
    }
  })
  app.route('/api/borrar-motor').put(async (req, res, next) => {
    try {
      let datos = await Datos.findOneAndUpdate({ id: 1 }, {
        $pull: { motor: req.body.motor }

      }, { new: true })
      res.json({ status: 200, datos });
    } catch (err) {
      next(err)
    }
  })
  app.route('/api/borrar-aceite').put(async (req, res, next) => {
    try {
      let datos = await Datos.findOneAndUpdate({ id: 1 }, {
        $pull: { aceite: req.body.aceite }

      }, { new: true })
      res.json({ status: 200, datos });
    } catch (err) {
      next(err)
    }
  })
  app.route('/api/borrar-marcaAceite').put(async (req, res, next) => {
    try {
      let datos = await Datos.findOneAndUpdate({ id: 1 }, {
        $pull: { marcaAceite: req.body.marcaAceite }

      }, { new: true })
      res.json({ status: 200, datos });
    } catch (err) {
      next(err)
    }
  })

  app.route('/api/send-email').post((req, res, next) => {
    try {
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.USER, // generated ethereal user
          pass: process.env.PASSWORD // generated ethereal password
        }
      });

      // send mail with defined transport object
      let info = transporter.sendMail({
        from: req.body.email, // sender address
        to: '"Federico Brunfman" <federicobrunfman@gmail.com>', // list of receivers
        subject: "Cotizacion", // Subject line
        html: `<h2>Cotización</h2><br><br><br><b>Patente: ${req.body.patente}</b><br><br><b>Email: ${req.body.email}</b><br><br><b>Marca: ${req.body.marca}</b><br><br><b>Modelo: ${req.body.modelo}</b><br><br><b>Año: ${req.body.ano}</b><br><br><b>Motor: ${req.body.motor}</b><br><br><b>Aceite: ${req.body.aceite}</b><br><br><b>Marca del aceite: ${req.body.marcaAceite}</b><br><br><b>Notas: ${req.body.notas}</b><br><br>` // html body
      });


      res.json({ status: 200 })


    } catch (err) {
      next(err)
    }
  })

});






const server = app.listen(PORT, console.log(`server running on ${process.env.NODE_ENV} mode on port ${PORT}`));







