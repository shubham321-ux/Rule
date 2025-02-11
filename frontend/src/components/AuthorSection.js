import React from 'react';
import "./css/AuthorSection.css";
import authorpic from "../assest/author.png"
const AuthorSection=()=>{
    const authordata=[
{
    name:"John Doe",
    image:authorpic,
    designation:"Author",
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."
},
{
    name:"John Doe",
    image:authorpic,
    designation:"Author",
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."
},{
    name:"John Doe",
    image:authorpic,
    designation:"Author",
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."
},{
    name:"John Doe",
    image:authorpic,
    designation:"Author",
    description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo."
},
    ]
return(<>
<div className='author-section-div-main'>
    <div className='author-title-div'>
        <div className='author-title-div-1'>
            <p className='author-title-para'>CUSTOMER REVIEWS</p>
            <h2 className='main-heading author-title-heading'>What our customers say</h2>
        </div>
        <p className='author-title-para-2'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.</p>

    </div>
    <div className='author-section-div-2'>
        {
            authordata.map((item)=>{
                return(
                    <div className='author-section-card'>
                        <div className='author-image-div'>
                            <img src={item.image} alt='author-image' />
                        </div>
                       <div className='text-div-for-author'>
                        <h1 className='author-name-title'>{item.name}</h1>
                        <p className='author-designation-title'>{item.designation}</p>
                       </div>
                    </div>
                )
            })
        }
    </div>
</div>
</>)
}
export default AuthorSection;