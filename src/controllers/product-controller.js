'use strict';

const ValidationContract = require('../validators/fluent-validator');
const repository = require('../repositories/product-repository');
const config = require('../config');
const guid = require('guid');
const assert = require('assert');
const azure = require('azure-storage');

exports.get = async (req, res, next) => {
    try {
        var data = await repository.get();
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição.'
        });
    }
}

exports.getBySlug = async (req, res, next) => {
    try {
        var data = await repository.getBySlug(req.params.slug);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição.'
        });
    }
}

exports.getById = async (req, res, next) => {
    try {
        var data = await repository.getById(req.params.id);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição.'
        });
    }
}

exports.getByTag = async (req, res, next) => {
    try {
        var data = await repository.getByTag(req.params.tag);
        res.status(200).send(data);
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição.'
        });
    }
}

exports.post = async (req, res, next) => {
    let contract = new ValidationContract();
    contract.hasMinLen(req.body.title, 3, 'O título deve conter pelo menos 3 caracteres.');
    contract.hasMinLen(req.body.slug, 3, 'O slug deve conter pelo menos 3 caracteres.');
    contract.hasMinLen(req.body.description, 3, 'A descrição deve conter pelo menos 3 caracteres.');

    //Se os dados forem inválidos
    if (!contract.isValid()) {
        res.status(400).send(contract.errors()).end();
        return;
    }

    try {
        //Create blob service
        const blobService = azure.createBlobService(config.containerConnectionString);

        let filename = guid.raw().toString() + '.jpg';
        let rawData = req.body.image;
        let matches = rawData.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let type = matches[1];
        let buffer = new Buffer.from(matches[2], 'base64');
        let container = 'product-images';
        let blockId = guid.raw();

        //Save image
        await blobService.createBlockFromText(blockId, container, filename, buffer, {
            contentType: type
        }, (error, result, response) => {
            if (error) {
                filename = 'default-product.png';
            }

            blobService.commitBlocks(container, filename, { LatestBlocks: [blockId] }, error =>  {
                assert.equal(error, null);
              });
        });

        await repository.create({
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            price: req.body.price,
            active: true,
            tags: req.body.tags,
            image: process.env.AZURE_STORAGE_URL + filename
        });
        res.status(201).send({
            message: 'Produto cadastrado com sucesso.'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição.'
        });
    }
};

exports.put = async (req, res, next) => {
    try {
        await repository.update(req.params.id, req.body);
        res.status(200).send({
            message: 'Produto atualizado com sucesso.'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição.'
        });
    }
};

exports.delete = async (req, res, next) => {
    try {
        await repository.delete(req.body.id);
        res.status(200).send({
            message: 'Produto removido com sucesso.'
        });
    } catch (e) {
        res.status(500).send({
            message: 'Falha ao processar a requisição.'
        });
    }
}