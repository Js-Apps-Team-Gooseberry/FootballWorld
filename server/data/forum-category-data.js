/* globals module */

module.exports = (models) => {
    const Category = models.ForumCategory;
    return {
        getAllCategories() {
            return new Promise((resolve, reject) => {
                Category
                    .find()
                    .sort({ createdOn: 1 })
                    .exec((error, categories) => {
                        if (error) {
                            return reject(error);
                        }
                        
                        return resolve(categories);
                    });
            });
        },
        createForumCategory(title, description, linkName, imageUrl) {
            return new Promise((resolve, reject) => {
                let createdOn = new Date();
                let category = new Category({ title, description, imageUrl, linkName, createdOn });

                category.save((error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
                });
            });
        }
    };
};