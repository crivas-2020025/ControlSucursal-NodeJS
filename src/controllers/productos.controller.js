const Productos = require('../models/productos.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

function obtenerProductoEmpresa (req, res) {

    Productos.find({idEmpresa: req.user.sub},(err, productosObtenidos) =>{
        if(err) return res.send({mensaje:"Error: "+err})
   
        return res.send({productos: productosObtenidos})
    })
}

function agregarProductoEmpresa(req, res) {
var parametros = req.body;
var productoModel = new Productos();

if (parametros.nombreProducto && parametros.nombreProducto && parametros.stock) {
    productoModel.nombreProducto = parametros.nombreProducto;
    productoModel.nombreProveedor = parametros.nombreProveedor;
    productoModel.stock = parametros.stock;
    productoModel.idEmpresa = req.user.sub;
}else {
    return res.status(500).send({ message: "error" })
}

Productos.find({ nombre: parametros.nombreProducto, nombreProveedor:parametros.nombreProveedor, stock: parametros.stock,idEmpresa:req.user.sub},
    (err, productoGuardado) => {
    if (productoGuardado.length==0) {
        productoModel.save((err, productosGuardados) => {
            console.log(err)
            if (err) return res.status(500).send({ message: "error en la peticion" });
            if (!productosGuardados) return res.status(404).send({ message: "No se puede agregar un producto" });
            return res.status(200).send({ productos: productosGuardados  });
        });
        
    } else {
        return res.status(500).send({ message: 'producto existente' });
    }
})
}

function editarProductoEmpresa(req,res){
var idProd = req.params.idProducto;
var paramentros = req.body; 

Productos.findOneAndUpdate({_id:idProd, idEmpresa:req.user.sub},paramentros,{new:true},
    (err,productoEditado)=>{
    if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
    if(!productoEditado) return res.status(400).send({mensaje: 'No se puede editar el producto'});
    return res.status(200).send({productos: productoEditado});
})
}

function eliminarProductoEmpresa(req,res){
var idProd = req.params.idProducto; 

Productos.findOneAndDelete({_id:idProd, idEmpresa:req.user.sub},
    (err,productoEliminado)=>{
    if(err) return res.status(500).send({mensaje: 'Error en la peticion'});
    if(!productoEliminado) return res.status(400).send({mensaje: 'No se puede eliminar el producto'});
    return res.status(200).send({productos: productoEliminado});

})
}


module.exports = {
    obtenerProductoEmpresa,
    agregarProductoEmpresa,
    editarProductoEmpresa,
    eliminarProductoEmpresa
}