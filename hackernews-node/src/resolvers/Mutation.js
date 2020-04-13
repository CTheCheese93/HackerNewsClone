// Mutation: {
//     post: (parent, args, context) => {
//         return context.prisma.createLink({
//             url: args.url,
//             description: args.description,
//         })
//     },
//     updateLink: (parent, args) => {
//         var link = links.filter((link) => link.id == args.id)[0]
//         if (args.url) {
//             link.url = args.url
//         }
//         if (args.description) {
//             link.description = args.description
//         }

//         return link
//     },
//     deleteLink: (parent, args) => {
//         var link = links.filter((_link) => _link.id == args.id)[0]
//         links = links.filter((link) => link.id != args.id)
//         return link
//     }
// }

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { APP_SECRET, getUserId } = require('../utils')

function post(parent, args, context) {
    const userId = getUserId(context)
    return context.prisma.createLink({
        url: args.url,
        description: args.description,
        postedBy: { connect: { id: userId }},
    })
}

function deleteLink(parent, args, context, info) {
    return context.prisma.deleteLink({ id: args.id })
}

async function signup(parent, args, context, info) {
    const password = await bcrypt.hash(args.password, 10)
    const user = await context.prisma.createUser({...args, password})
    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

async function login(parent, args, context, info) {
    const user = await context.prisma.user({ email: args.email })
    if(!user) {
        throw new Error('No such user found')
    }

    const valid = await bcrypt.compare(args.password, user.password)
    if(!valid) {
        throw new Error('Invalid password')
    }

    const token = jwt.sign({ userId: user.id }, APP_SECRET)

    return {
        token,
        user,
    }
}

async function vote(parent, args, context, info) {
    const userId = getUserId(context)

    const voteExists = await context.prisma.$exists.vote({
        user: { id: userId },
        link: { id: args.linkId },
    })

    if (voteExists) {
        throw new Error(`Already voted for link: ${args.linkId}`)
    }

    return context.prisma.createVote({
        user: { connect: { id: userId }},
        link: { connect: { id: args.linkId }}
    })
}

module.exports = {
    post,
    login,
    signup,
    vote,
    deleteLink
}