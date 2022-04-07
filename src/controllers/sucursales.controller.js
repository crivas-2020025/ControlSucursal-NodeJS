const Sucursales = require('../models/sucursales.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function ObtenerSucursales (req, res) {

        Sucursales.find({idEmpresa: req.user.sub},(err, sucursalesObtenidas) =>{
            if(err) return res.send({mensaje:"Error: "+err})
       
            return res.send({empleados: sucursalesObtenidas})
        })
}

function ObtenerSucursalId(req, res){
    var idSucursal = req.params.idSucursal

    Sucursales.findById(idSucursal,(err,sucursalEncontrada)=>{
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (!sucursalEncontrada) return res.status(404).send( { mensaje: 'Error al obtener la Empresa' });

        return res.status(200).send({ sucursales: sucursalEncontrada });
    })
}

function agregarSucursal(req, res) {
    var parametros = req.body;
    var sucursalModel = new Sucursales();

    if (parametros.nombreSucursal && parametros.direccionSucursal) {
        sucursalModel.nombreSucursal = parametros.nombreSucursal;
        sucursalModel.direccionSucursal = parametros.direccionSucursal;
        sucursalModel.idEmpresa = req.user.sub;
    }else {
        return res.status(500).send({ message: "error" })
    }

    Sucursales.find({ nombre: parametros.nombreSucursal, direccion:parametros.direccionSucursal, idEmpresa:req.user.sub},
        (err, sucursalGuardada) => {
        if (sucursalGuardada.length==0) {
            sucursalModel.save((err, sucursalesGuardadas) => {
                console.log(err)
                if (err) return res.status(500).send({ message: "error en la peticion" });
                if (!sucursalesGuardadas) return res.status(404).send({ message: "No se puede agregar una sucursal" });
                return res.status(200).send({ sucursales: sucursalesGuardadas  });
            });
            
        } else {
            return res.status(500).send({ message: 'sucursal existente' });
        }
    })
}

function editarSucursal(req,res){
    var idSuc = req.params.idSucursal;
    var paramentros = req.body; 

    Sucursales.findOneAndUpdate({_id:idSuc, idEmpresa:req.user.sub},paramentros,{new:true},
        (err,sucursalEditada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!sucursalEditada) return res.status(400).send({mensaje: 'No se puede editar la sucursal'});
        return res.status(200).send({sucursal: sucursalEditada});
    })
}

function eliminarSucursal(req,res){
    var idSuc = req.params.idSucursal; 

    Empleados.findOneAndDelete({_id:idSuc, idEmpresa:req.user.sub},
        (err,sucursalEliminada)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
        if(!sucursalEliminada) return res.status(400).send({mensaje: 'No se puede eliminar el empleado'});
        return res.status(200).send({empleado: sucursalEliminada});

    })
}

module.exports = {
    ObtenerSucursales,
    agregarSucursal,
    editarSucursal,
    eliminarSucursal,
    ObtenerSucursalId
}