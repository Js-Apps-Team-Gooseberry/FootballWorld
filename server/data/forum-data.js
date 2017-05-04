/* globals module */

module.exports = (models) => {
    const Thread = models.Thread,
        Post = models.Post;

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

                    return resolve(dbThread);
                });
            });
        },
        getNotDeletedThreadsByCategory(category, page) {
            const pageSize = 10;

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

                        return resolve(threads);
                    });
            });
        },
        getThreadById(id) {
            return new Promise((resolve, reject) => {
                Thread.findOne({ _id: id }, (error, thread) => {
                    if (error) {
                        return reject(error);
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
                    thread.save((error, success) => {
                        if (error) {
                            return reject(error);
                        }

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
                Thread.update({ _id: threadId }, { $set: { isDeleted: true } }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
                });
            });
        },
        flagThreadAsActive(threadId) {
            return new Promise((resolve, reject) => {
                Thread.update({ _id: threadId }, { $set: { isDeleted: false } }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
                });
            });
        },
        deleteThread(threadId) {
            return new Promise((resolve, reject) => {
                Thread.findOneAndRemove({ _id: threadId }, (error, result) => {
                    if (error) {
                        return reject(error);
                    }

                    return resolve(result);
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

                        return resolve(result);
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

                    thread.save((error, result) => {
                        if (error) {
                            return reject(error);
                        }

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
                        thread.likes.push(username);

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

                        return resolve(result);
                    });
                });
            });
        }
    };
};