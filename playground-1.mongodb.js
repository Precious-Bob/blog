// Select the database to use.
use('blogdb');

db.posts.updateMany(
  {},
  {
    $set: {
      createdAt: new Date(), // Set the appropriate creation date
    },
  }
);
