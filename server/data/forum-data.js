/* globals module require */

module.exports = (models) => {
    const Thread = models.Thread,
        Post = models.Post,
        Category = models.ForumCategory,
        pageCalculator = require('../utils/page-calculator');

    return {
        createNewThread(title, content, imageUrl, category, tagsStr, authorId, authorUsername, authorAvatar) {
            return new Promise((resolve, reject) => {
                let createdOn = new Date();
                let lastPostCreatedOn = new Date();
                let tags = tagsStr.split(',').map(x => x.trim()).filter(x => x != '');
                let author = {
                    username: authorUsername,
                    userId: authorId,
                    userAvatar: authorAvatar
                };

                let thread = new Thread({ title, content, createdOn, lastPostCreatedOn, imageUrl, author, category, tags });
                thread.save((error, dbThread) => {
                    if (error) {
                        return reject(error);
                    }

                    Category.findOne({ linkName: category }, (error, category) => {
                        category.lastPost = {
                            author: author.username,
                            createdOn: new Date(),
                            thread: title
                        };

                        category.threads += 1;
                        category.save();
                    });

                    return resolve(dbThread);
                });
            });
        },
        getNotDeletedThreadsByCategory(category, page) {
            const pageSize = 8;

            return new Promise((resolve, reject) => {
                Thread.find({ category: category })
                    .where({ isDeleted: false })
                    .sort({ lastPostCreatedOn: -1 })
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec((error, threads) => {
                        if (error) {
                            return reject(error);
                        }

                        Thread.count({ category: category }, (error, count) => {
                            if (error) {
                                return reject(error);
                            }

                            let pagesCount = pageCalculator.getPagesCount(count, pageSize);
                            let data = {
                                threads,
                                pagesCount
                            };

                            return resolve(data);
                        });
                    });
            });
        },
        getThreadById(id) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: id }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    }

                    if (!thread) {
                        return resolve();
                    }

                    thread.views += 1;
                    thread.save();

                    return resolve(thread);
                });
            });
        },
        getThreadByIdWithoutRecordingViews(id) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: id }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(thread);
                });
            });
        },
        createNewPost(threadId, content, username, userId, userAvatar) {
            return new Promise((resolve, reject) => {
                let createdOn = new Date();
                let author = {
                    username,
                    userAvatar,
                    userId
                };

                let post = new Post({ content, author, createdOn });
                Thread.findOne({ _id: threadId }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    } else if (!thread) {
                        return reject('No such thread found!');
                    }

                    thread.posts.push(post);

                    thread.lastPost.author = post.author.username;
                    thread.lastPost.userId = post.author.userId;
                    thread.lastPostCreatedOn = post.createdOn;

                    thread.save((error, success) => {
                        if (error) {
                            return reject(error);
                        }

                        Category.findOne({ linkName: thread.category }, (error, category) => {
                            category.lastPost = {
                                author: author.username,
                                createdOn: new Date(),
                                thread: thread.title
                            };

                            category.posts += 1;
                            category.save();
                        });

                        return resolve(success);
                    });
                });
            });
        },
        editThread(threadId, title, content, imageUrl, category, tagsStr) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: threadId }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    } else if (!thread) {
                        return reject('No such thread found!');
                    }

                    let tags = tagsStr.split(',').map(x => x.trim()).filter(x => x != '');

                    thread.title = title;
                    thread.content = content;
                    thread.imageUrl = imageUrl;
                    thread.category = category;
                    thread.tags = tags;

                    thread.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(result);
                    });
                });
            });
        },
        flagThreadAsDeleted(threadId) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: threadId }, (error, thread) => {
                    if (error) {
                        console.log(error);
                        return reject(error);
                    }

                    thread.isDeleted = true;
                    thread.save((error, success) => {
                        if (error) {
                            console.log(error);
                            return reject(error);
                        }
                        console.log('here');
                        Category.findOne({ linkName: thread.category }, (error, category) => {
                            console.log(error);
                            category.threads -= 1;
                            category.posts -= thread.posts.length;
                            category.save();
                        });

                        return resolve(success);
                    });
                });
            });
        },
        flagThreadAsActive(threadId) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: threadId }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    }

                    thread.isDeleted = false;
                    thread.save((error, success) => {
                        if (error) {
                            return reject(error);
                        }

                        Category.findOne({ linkName: thread.category }, (error, category) => {
                            category.threads += 1;
                            category.posts += thread.posts.length;
                            category.save();
                        });

                        return resolve(success);
                    });
                });
            });
        },
        deleteThread(threadId) {
            return new Promise((resolve, reject) => {
                Thread.findOneAndRemove({ _id: threadId }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    }

                    if (!thread.isDeleted) {
                        Category.findOne({ linkName: thread.category }, (error, category) => {
                            category.threads -= 1;
                            category.posts -= thread.posts.length;
                            category.save();
                        });
                    }

                    return resolve(thread);
                });
            });
        },
        editPost(threadId, postId, content) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: threadId }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    } else if (!thread) {
                        return reject('No such thread found!');
                    } else if (!thread.posts) {
                        return reject('No such post found!');
                    }

                    let post = thread.posts.find(p => p._id.toString() == postId);
                    if (!post) {
                        return reject('No such post found!');
                    }

                    post.content = content;

                    thread.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(post);
                    });
                });
            });
        },
        deletePost(threadId, postId) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: threadId }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    } else if (!thread) {
                        return reject('No such thread found!');
                    } else if (!thread.posts) {
                        return reject('No such post found!');
                    }

                    let post = thread.posts.find(p => p._id.toString() == postId);
                    if (!post) {
                        return reject('No such post found!');
                    }

                    let index = thread.posts.indexOf(post);
                    thread.posts.splice(index, 1);

                    if (thread.posts.length) {
                        let lastPost = thread.posts[thread.posts.length - 1];
                        thread.lastPost.author = lastPost.author.username;
                        thread.lastPost.userId = lastPost.author.userId;
                        thread.lastPostCreatedOn = lastPost.createdOn;
                    } else {
                        thread.lastPost = null;
                        thread.lastPostCreatedOn = thread.createdOn;
                    }

                    thread.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        Category.findOne({ linkName: thread.category }, (error, category) => {
                            category.posts -= 1;
                            category.save();
                        });

                        return resolve(result);
                    });
                });
            });
        },
        toggleLikeThread(threadId, username) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: threadId }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    } else if (!thread) {
                        return reject('No such thread found!');
                    }

                    if (!thread.likes || !thread.likes.includes(username)) {
                        thread.likes.push(username);

                        if (thread.dislikes && thread.dislikes.includes(username)) {
                            let index = thread.dislikes.indexOf(username);
                            thread.dislikes.splice(index, 1);
                        }
                    } else {
                        let index = thread.likes.indexOf(l => l == username);
                        thread.likes.splice(index, 1);
                    }

                    thread.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(result);
                    });
                });
            });
        },
        toggleDislikeThread(threadId, username) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: threadId }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    } else if (!thread) {
                        return reject('No such thread found!');
                    }

                    if (!thread.dislikes || !thread.dislikes.includes(username)) {
                        thread.dislikes.push(username);

                        if (thread.likes && thread.likes.includes(username)) {
                            let index = thread.likes.indexOf(username);
                            thread.likes.splice(index, 1);
                        }
                    } else {
                        let index = thread.dislikes.indexOf(l => l == username);
                        thread.dislikes.splice(index, 1);
                    }

                    thread.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(result);
                    });
                });
            });
        },
        toggleLikePost(threadId, postId, username) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: threadId }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    } else if (!thread) {
                        return reject('No such thread found!');
                    } else if (!thread.posts) {
                        return reject('No such post found!');
                    }

                    let post = thread.posts.find(p => p._id.toString() == postId);
                    if (!post) {
                        return reject('No such post found!');
                    }

                    if (!post.likes || !post.likes.includes(username)) {
                        post.likes.push(username);

                        if (post.dislikes && post.dislikes.includes(username)) {
                            let index = post.dislikes.indexOf(username);
                            post.dislikes.splice(index, 1);
                        }
                    } else {
                        let index = post.likes.indexOf(l => l == username);
                        post.likes.splice(index, 1);
                    }

                    thread.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(post);
                    });
                });
            });
        },
        toggleDislikePost(threadId, postId, username) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: threadId }, (error, thread) => {
                    if (error) {
                        return reject(error);
                    } else if (!thread) {
                        return reject('No such thread found!');
                    } else if (!thread.posts) {
                        return reject('No such post found!');
                    }

                    let post = thread.posts.find(p => p._id.toString() == postId);
                    if (!post) {
                        return reject('No such post found!');
                    }

                    if (!post.dislikes || !post.dislikes.includes(username)) {
                        post.dislikes.push(username);

                        if (post.likes && post.likes.includes(username)) {
                            let index = post.likes.indexOf(username);
                            post.likes.splice(index, 1);
                        }
                    } else {
                        let index = post.dislikes.indexOf(l => l == username);
                        post.dislikes.splice(index, 1);
                    }

                    thread.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        return resolve(post);
                    });
                });
            });
        },
        getAllThreadsAdmin(page, query, sort) {
            let pageSize = 10;

            let sortMethod = sort == 'status' ? { isDeleted: -1, lastPostCreatedOn: -1 } : sort == 'category' ? { category: 1, lastPostCreatedOn: -1, } : { lastPostCreatedOn: -1 };
            let queryObj = query.trim() ? { title: { '$regex': query.trim(), '$options': 'i' } } : {};

            return new Promise((resolve, reject) => {
                Thread.find(queryObj)
                    .sort(sortMethod)
                    .skip((page - 1) * pageSize)
                    .limit(pageSize)
                    .exec((error, threads) => {
                        if (error) {
                            return reject(error);
                        }

                        Thread.count(queryObj, (error, count) => {
                            if (error) {
                                return reject(error);
                            }

                            let pagesCount = pageCalculator.getPagesCount(count, pageSize);
                            let result = {
                                threads,
                                pagesCount
                            };

                            return resolve(result);
                        });
                    });
            });
        }
    };
};