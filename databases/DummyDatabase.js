module.exports = function DummyDatabase() {
    this.find = (query) => ({
        _id: '0000000000000001',
        email: 'akobashikawa@gmail.com',
        name: 'Antonio Eduviges',
        lastname: 'Kobashikawa Carrasco',
        role: 'user',
    });
};