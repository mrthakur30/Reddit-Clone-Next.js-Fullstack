import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request){
     try{
        const session = await getAuthSession() ;
        if(!session?.user){
            return new Response('Unautorized',{status:401})
        }
        const body = await req.json() ;

        const {subredditId} = SubredditSubscriptionValidator.parse(body) ;

        const subscriptionExists = await db.subscription.findFirst({
            where : {
                subredditId  ,
                userId : session.user.id
            }
        })

        if(subscriptionExists){
            return new Response('You already subscribed to subrediit', {status:400})
        }

        await db.subscription.create({
            data : {
                subredditId ,
                userId : session.user.id
            }
        })
        return new Response(subredditId)
     }catch(err){
        if(err instanceof z.ZodError){
             return new Response('Invalid request data passed',{status:422})
        }
        return new Response('Could not subscribe , try again',{status:500})
     }
}