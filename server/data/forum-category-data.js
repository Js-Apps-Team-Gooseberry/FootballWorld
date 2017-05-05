/* globals module */

module.exports = (models) => {
    const Category = models.ForumCategory;
    return {
        getAllCategories() {
            return new Promise((resolve, reject) => {
                Category.find((error, categories) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(categories);
                });
            });
        },
        createForumCategory(title, description, linkName, imageUrl) {
            return new Promise((resolve, reject) => {
                let category = new Category({ title, description, imageUrl, linkName });

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