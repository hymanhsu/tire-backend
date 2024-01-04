import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
    log: [
        // {
        //     emit: 'event',
        //     level: 'query',
        // },
        {
            emit: 'stdout',
            level: 'error',
        },
    ]
});

// prisma.$on('query', (e) => {
//     if (process.env.NODE_ENV != 'prod') {
//         console.log('Query: ' + e.query)
//         console.log('Params: ' + e.params)
//         console.log('Duration: ' + e.duration + 'ms')
//     }
// })


