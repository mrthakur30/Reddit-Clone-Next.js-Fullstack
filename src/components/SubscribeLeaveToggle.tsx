"use client"
import { FC, startTransition } from 'react';
import { Button } from './ui/Button';
import { useMutation } from '@tanstack/react-query';
import { SubscribeToSubredditPayload } from '@/lib/validators/subreddit';
import axios, { AxiosError } from 'axios';
import { useCustomToasts } from '@/hooks/use-custom-toasts';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface SubscribeLeaveToggleProps { 
  subredditId : string
  subredditName : string
  isSubscribed : boolean
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({ subredditId , subredditName , isSubscribed }) => {
  const router = useRouter();

  const {loginToast} = useCustomToasts();

  const {mutate : subscribe , isLoading : isSubLoading} = useMutation({
    mutationFn : async () =>{
       const payload : SubscribeToSubredditPayload = {
           subredditId ,
       }

       const {data} = await axios.post('/api/subreddit/subscribe', payload)
       return data as string
    },
    onError : (err) =>{
       if(err instanceof AxiosError){
          if(err.response?.status === 401){
             return loginToast()
          }
       }

       return toast({
          title : "There was a problem",
          description : "Sorry about that, please try again later",
          variant : "destructive"
       })
    },
    onSuccess : () =>{
      startTransition(()=>{
          router.refresh() ;
      })
      return toast({
          title : "Subscribed",
          description : `You have successfully subscribed to ${subredditName} community`,
          variant : "default"
      })
    }
  })
  
  
  const {mutate : unsubscribe , isLoading : isUnSubLoading} = useMutation({
    mutationFn : async () =>{
       const payload : SubscribeToSubredditPayload = {
           subredditId ,
       }

       const {data} = await axios.post('/api/subreddit/unsubscribe', payload)
       return data as string
    },
    onError : (err) =>{
       if(err instanceof AxiosError){
          if(err.response?.status === 401){
             return loginToast()
          }
       }

       return toast({
          title : "There was a problem",
          description : "Sorry about that, please try again later",
          variant : "destructive"
       })
    },
    onSuccess : () =>{
      startTransition(()=>{
          router.refresh() ;
      })
      return toast({
          title : "Unsubscribed",
          description : `You have successfully unsubscribed from ${subredditName} community`,
          variant : "default"
      })
    }
  })




  return isSubscribed ? (
    <Button isLoading={isUnSubLoading} onClick={()=>unsubscribe()} className="w-full mt-1 mb-4">Leave Community</Button>
  ) : (
    <Button isLoading={isSubLoading} onClick={()=>subscribe()} className="w-full  mt-1 mb-4">Join Community</Button>
  )
};

export default SubscribeLeaveToggle;

