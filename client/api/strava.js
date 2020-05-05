import axios from 'axios'

export const NULL_USER = {
    avatar: null,
    firstname: null,
    lastname: null,
    athleteId: null,
  }

export function getCurrentUser(){
    console.log('Get Current User');
    return new Promise((resolve,reject)=>{
            axios.get(`/api/getStravaUser`)
            .then(result =>{
                return resolve(result.data)
            })
            .catch(err=>{
                console.log('OH no!!!');
                console.log(err);
                return reject()
            })
      

    })
}
