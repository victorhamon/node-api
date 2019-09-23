global.SALT_KEY = 'f5b99242-6504-4ca3-90f2-05e78e5761ef';
global.EMAIL_TMPL = 'Olá, <strong>{0}</strong>, seja bem vindo ao Node Store!';

module.exports = {
    connectionString: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-6zscd.mongodb.net/node-str?retryWrites=true&w=majority`,
    containerConnectionString: 'TBD'
}