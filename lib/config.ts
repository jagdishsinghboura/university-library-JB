const config={
    env:{
        apiEndpoint:process.env.NEXT_PUBLIC_API_ENDPOINT!,
        imagekit:{
            publicKey :process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
            privateKey :process.env.NEXT_PUBLIC_IMAGEKIT_PRIVATE_KEY!,
            urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL!

        },
        databaseUrl:process.env.DATABASE_URL!,
        upstash:{
            redisUrl:process.env.UPSTASH_REDIS_URL!,
            redisToken:process.env.UPSTASH_REDIS_TOKEN!,
            qstashUrl:process.env.QSTASH_URL!,
            qsToken:process.env.QSTASH_TOKEN!,
        },
        
    }
}

export default config;