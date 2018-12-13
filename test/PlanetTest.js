const chai = require('chai');
const sinon = require('sinon');
const req = require('supertest');
const expect = chai.expect;
const query = require('querystring');

const url = 'http://localhost:8080/planetas';

const cTimeout = 60000;

describe('Routes', () => {
    var Planet = {};
    it('create', (done) => {
        req(url).post('')
        .send({
            name: 'Planeta Teste',
            terrain: 'Terreno Teste',
            climate: 'Clima Teste'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
            if(!('success' in res.body)) throw new Error('Faltando resposta padrão de sucesso');
            if(!('data' in res.body) && res.body.success == true) throw new Error('Faltando resposta padrao para dados');
            Planet = res.body.data;
            done();
        })
    }).timeout(cTimeout)

    it('list', (done) => {
        req(url).get('')
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
            if(!('success' in res.body)) throw new Error('Faltando resposta padrão de sucesso');
            if(!('data' in res.body)) throw new Error('Faltando resposta padrao para dados');
        }).end(done)
    })
    it('retrieveById', (done) => {
        req(url).get('/' + Planet._id)
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
            if(!('success' in res.body)) throw new Error('Faltando resposta padrão de sucesso');
            if(!('data' in res.body)) throw new Error('Faltando resposta padrao para dados');

            if(res.body.data.name !== 'Planeta Teste') throw new Error('Nome incorreto');
            if(res.body.data.terrain !== 'Terreno Teste') throw new Error('Terreno está Incorreto');
            if(res.body.data.climate !== 'Clima Teste') throw new Error('Clima está Incorreto');
            if(res.body.data.apparitions !== 0) throw new Error('Número de aparições incorretas');
        }).end(done)
    })
    it('retrieveByName', (done) => {
        req(url).get('/?' + query.stringify({name: Planet.name}))
        .expect('Content-Type', /json/)
        .expect(200)
        .expect((res) => {
            if(!('success' in res.body)) throw new Error('Faltando resposta padrão de sucesso');
            if(!('data' in res.body)) throw new Error('Faltando resposta padrao para dados');

            if(res.body.data[0].name !== 'Planeta Teste') throw new Error('Nome incorreto');
            if(res.body.data[0].terrain !== 'Terreno Teste') throw new Error('Terreno está Incorreto');
            if(res.body.data[0].climate !== 'Clima Teste') throw new Error('Clima está Incorreto');
            if(res.body.data[0].apparitions !== 0) throw new Error('Número de aparições incorretas');
        }).end(done)
    })

    it('delete', (done) => {
        req(url).delete('/' + Planet._id)
        .expect(200)
        .expect((res) => {
            if(!('success' in res.body)) throw new Error('Faltando resposta padrão de sucesso');
        }).end(done)
    })
});