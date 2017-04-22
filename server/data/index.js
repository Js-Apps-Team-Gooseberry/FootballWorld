/* globals module */

const users = [
    { username: 'test', password: 'test', role: 'admin', id: 1 },
    { username: 'test2', password: 'test2', role: 'user', id: 2 }
];

module.exports = {
    findUserById(id) {
        return new Promise((resolve, reject) => {
            let user = users.find(x => x.id === id);
            if (user) {
                return resolve(user);
            }

            return reject();
        });
    }
};