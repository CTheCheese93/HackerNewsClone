function user(parent, args, context, info) {
    return context.prisma.vote({ id: parent.id }).user()
}

function link(parent, args, context, info) {
    return context.prisma.vote({ id: parent.id }).link()
}

module.exports = {
    user,
    link,
}