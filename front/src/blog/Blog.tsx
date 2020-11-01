import React from 'react';
import './style.css'

import { urlRoot } from '../settings'

import { Post } from '../post'
import { NewPost } from '../newPost'

import { TPost } from '../types'


export default function Blog() {

    let [posts, setPosts] = React.useState<TPost[]>([])

    React.useEffect(() => {
        getPosts()
    }, [])

    const getPosts = async () => {
        let response;
        response = await fetch(
            `${ urlRoot }/blog/posts`
        )

        let data = await response.json()
        setPosts(data)
    }

    return <div className='content_area'>
        <NewPost {...{
            addNewPost: (post: TPost) => {
                setPosts([])
                setPosts([post].concat(posts))
            },
        }}/>
        
        <div>
            { posts.map( (post) => <Post { ...post }/> ) }
        </div>
    </div>
}