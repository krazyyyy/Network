document.addEventListener('DOMContentLoaded', () => {
    // tog == Toggle!!
    document.querySelectorAll('#follow_btn').forEach(tog => { tog.onclick = () => { follow(tog)}})
    document.querySelectorAll('#del_btn').forEach(tog => { tog.onclick = () => { delete_post(tog)}})
    document.querySelectorAll('#hide_btn').forEach(tog => { tog.onclick = () => { hidePost(tog) }})
    form = document.querySelector('#newpost')
    if (form)
    {
    form.addEventListener('submit', () => {
        post()
    })
}


})

function post(){
    fetch('/post', {
        method : 'POST',
        body : JSON.stringify({
           body : document.querySelector('#createpost').value,
        })

    })
    .then(response => response.json())
    .then(data => {
        alert(data.message)
        console.log(data)

    })
}



function follow(f){
    fetch('/follow',{
        method : 'POST',
        body : JSON.stringify({
            follow : f.getAttribute('data-user'),
            span : document.querySelector('.spn_txt').innerHTML
        }) 
    })
    .then(response => response.json())
    .then(data => {
        spn = document.querySelector('.spn_txt')
        following = document.querySelector('#following-count')
        follower = document.querySelector('#follower-count')
        if (spn.innerHTML == 'Follow')
        {
            spn.innerHTML = "Following"
            fol = document.querySelector('#follow_btn')
            fol.classList.toggle('following') && fol.classList.remove('follow')
            following.innerHTML = data.followings
            follower.innerHTML = data.followers
            
        }
        else
        {
            spn.innerHTML = "Follow"
            fol = document.querySelector('#follow_btn')
            fol.classList.toggle('follow') && fol.classList.remove('following')
            following.innerHTML = data.followings
            follower.innerHTML = data.followers
        }
        
    })

}

function edit(f){
    // fetch('/edit',{
    //     method : 'POST',
    //     body : JSON.stringify({
    //         post_id : f,
    //     }) 
    // })
    // .then(response => response.json())
    // .then(data => {
        document.querySelector(`#post${f}`).style.display = 'none';
        document.querySelector(`#time${f}`).style.display = 'none';
        document.querySelector(`#edit_post${f}`).style.display = 'block';
        document.querySelector(`#save-edit-post${f}`).style.display = 'block';
        document.querySelector(`#managerow${f}`).style.display = 'none';

        
    // })

}

function editPost(f){
    fetch('/edit', {
        method : 'POST',
        body : JSON.stringify({
            post_id : f,
            post : document.querySelector(`#edit_post${f}`).value
        })
    })
    .then(response => response.json())
    .then(data => {
        document.querySelector(`#post${f}`).style.display = 'block';
        document.querySelector(`#edit_post${f}`).style.display = 'none';
        document.querySelector(`#save-edit-post${f}`).style.display = 'none';
        document.querySelector(`#managerow${f}`).style.display = 'block';
    })
}

function delete_post(f){
    fetch('/delete',{
        method : 'POST',
        body : JSON.stringify({
            post_id : f.getAttribute('data-id'),
        }) 
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message)
        console.log(data)

    })

}

function like(f){
    fetch('/like',{
        method : 'POST',
        body : JSON.stringify({
            like_id : f,
            span : document.querySelector(`#like_txt${f}`).innerHTML
        }) 
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        // document.querySelector(`#total-like${f.getAttribute('data-id')}`).innerHTML = data.like
        document.querySelector(`#total-like${f}`).innerHTML = data.like
        likeTxt = document.querySelector(`#like_txt${f}`)
        if (likeTxt.innerHTML == 'Liked')
        {
            likeTxt.innerHTML = 'Like'
            document.querySelector(`#like_btn${f}`).classList.remove('liked_p')
            document.querySelector(`#like_btn${f}`).classList.remove('liked_post')
        }
        else
        {
            likeTxt.innerHTML = 'Liked'
            document.querySelector(`#like_btn${f}`).classList.toggle('liked_post')
        }
        
    })
}


function managePost(h){
    let menu = document.querySelector(`#man${h}`)
    menu.classList.toggle('active-menu')
}

function hidePost(h){
    post = document.querySelector(`#post_no${h.getAttribute('data-id')}`)
    post.classList.toggle('post_hide')
}

const $button  = document.querySelector('#sidebar-toggle');
const $wrapper = document.querySelector('#wrapper');

$button.addEventListener('click', (e) => {
  e.preventDefault();
  $wrapper.classList.toggle('toggled');
});


(function($){"use strict";$('.input100').each(function(){$(this).on('blur',function(){if($(this).val().trim()!=""){$(this).addClass('has-val');}
else{$(this).removeClass('has-val');}})})
var input=$('.validate-input .input100');$('.validate-form').on('submit',function(){var check=true;for(var i=0;i<input.length;i++){if(validate(input[i])==false){showValidate(input[i]);check=false;}}
return check;});$('.validate-form .input100').each(function(){$(this).focus(function(){hideValidate(this);});});function validate(input){if($(input).attr('type')=='email'||$(input).attr('name')=='email'){if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/)==null){return false;}}
else{if($(input).val().trim()==''){return false;}}}
function showValidate(input){var thisAlert=$(input).parent();$(thisAlert).addClass('alert-validate');}
function hideValidate(input){var thisAlert=$(input).parent();$(thisAlert).removeClass('alert-validate');}})(jQuery);