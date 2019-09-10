import { GraphQLServer } from 'graphql-yoga';

const users = [
  {
    id: '1',
    name: 'Julia',
    email: 'julia@gmail.com',
    age: 28,
  },
  {
    id: '2',
    name: 'Irena',
    email: 'irena@gmail.com',
    age: 35,
  },
  {
    id: '3',
    name: 'Kit',
    email: 'kit@gmail.com',
    age: 31,
  },
];

const posts = [
  {
    id: 'abc12348',
    title: 'News',
    body: 'News post',
    published: true,
    author: '1'
  },
  {
    id: 'abc12345',
    title: 'World news',
    body: 'World news post',
    published: true,
    author: '1'
  },
  {
    id: 'abc12346',
    title: 'Sport',
    body: 'Sport post',
    published: true,
    author: '2'
  },
  {
    id: 'abc12347',
    title: 'Culture',
    body: 'Culture post',
    published: true,
    author: '3'
  },
];

const comments = [
  { id: '1', text: 'Comment #1', author: '1', post: 'abc12348' },
  { id: '2', text: 'Comment #2', author: '1', post: 'abc12345' },
  { id: '3', text: 'Comment #3', author: '2', post: 'abc12346' },
  { id: '4', text: 'Comment #4', author: '3', post: 'abc12347' }
];

const typeDefs = `
  type Query {
    greeting(name: String, position: String!): String!
    add(numbers: [Float!]): Float!
    grades: [Int!]!
    me: User!
    post: Post!
    comment: Comment!
    users(query: String): [User!]!
    posts(query: String): [Post!]!
    comments: [Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int,
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`

const resolvers = {
  Query: {
    greeting(parent, args, ctx, info) {
      if (args.name && args.position) {
        return `Hello ${args.name}! You are my favorite ${args.position}`
      } else {
        return "Hello!"
      }
    },
    add(parent, args) {
      if (args.numbers.lenght == 0) {
        return 0
      }

      return args.numbers.reduce((accumulator, currentValue) => {
          return accumulator + currentValue
        }
      )
    },
    grades(parent, args, ctx, info) {
      return [90, 48, 50]
    },
    me() {
      return {
        id: '1',
        name: 'John Doe',
        email: 'example.gmail.com',
        age: 26
      }
    },
    post() {
      return {
        id: 'abc123',
        title: 'Some post',
        body: 'Body of post',
        published: true,
        author: '1'
      }
    },
    comment() {
      return {
        id: '1',
        text: 'Comment',
        author: '1',
        post: 'abc'
      }
    },
    users(parent, args, ctx, info) {
      if(!args.query) {
        return users
      }

      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase())
      })
    },
    posts(parent, args, ctx, info) {
      if(!args.query) {
        return posts
      }

      return posts.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(args.query.toLowerCase());
        const bodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase());
        return titleMatch || bodyMatch
      })
    },
    comments() {
      return comments;
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author
      })
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id
      })
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id
      })
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author
      })
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post
      })
    }
  }
}

const server = new GraphQLServer({
  typeDefs,
  resolvers
})

server.start(() => {
  console.log('Server is up!')
});
