var express = require('express');
var router = express.Router();
const USER = require('../model/user');
const COURSE = require('../model/course');
const bcrypt = require('bcrypt');

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('signup');
});

router.get('/registered', async(req, res) => {
  const emails = req.query.email;
 
  console.log('em:', emails);
  try{
    const registerList = await COURSE.aggregate([
              {
                $match : { registeredStudents : emails },
              }
       ]);
    res.render('registered', {registerList});
    

  }catch (err){
    console.log("err:", err);
  }
});

router.post('/registeruser', async(req,res)=> {

try {
  
  // const { name, email, pasword } = req.body
  var name = req.body.name;
  var name = name.trim();

  var email = req.body.email;
  var email = email.trim();

  var pasword = req.body.pasword;
  var pasword = pasword.trim();

  var pasword1 = req.body.pasword1;
  var pasword1 = pasword1.trim();

if( name != '' && email != '' && pasword != '' && name != undefined && email != undefined && pasword != undefined ){

if(pasword == pasword1){


  const emailExist = await USER.findOne({email : email});

  if(emailExist){
    return res.send("Email already exist");
  } else{

    const user = new USER({
      name : name,
      email : email,
      password : pasword
    });
  
    const newUser = await user.save();
    res.redirect('/users/login');

  }
} else{
  res.send("password and confirm password not match");
}
} else{
  res.send("Please fill all the fields");
}

} catch (error) {
  console.log("👽 ~ router.post ~ error:", error)
}

});

router.post('/loginuser', async(req,res)=> {

  try {
    const { email, password } = req.body;
  
    const emailExist = await USER.findOne({email : email});
    
  
  if(emailExist){
    const loginStatus = email;
  
    if(emailExist.password == password){
  
  res.render(`index`,{ loginStatus });
  
    } else{
      res.send('password is incorrect');
    }
  
  } else{
    res.send("Register First");
  }
  
  
  } catch (error) {
    console.log("👽 ~ router.post ~ error:", error)
  }
  
  });

router.get('/course',async(req, res) => {
  const courseList = await COURSE.find();
  
  res.render('course', { courseList });
});

router.post('/addd', async(req, res) => {

  try{

    console.log(req.body,'addd');

    const email = req.body.email;
    const id = req.body.id.trim();
    

    const availCheck = await COURSE.findById(id);
    console.log(availCheck?.registeredStudents.includes(email),availCheck,email,'ewfrwefwe');
    if(availCheck?.registeredStudents.includes(email)){
      
      return res.status(200).json({
        success : false,
        mesage : 'You Already Subscribed This Course '
      });
    }

    if(availCheck?.availableSeats > 0){

      const result = await COURSE.findByIdAndUpdate(id, { $push: { registeredStudents: email }  });
      const result1 = await COURSE.findByIdAndUpdate(id, { $inc: { availableSeats: -1 } });

      res.status(200).json({
        success : true,
        mesage : 'Subscribed To Course SuccessFully'
      });

    } else {

      res.status(200).json({
        success : false,
        mesage : 'Course Were Filled'
      });

    }

    

   

  }catch (err){
    console.log('err:', err);

  }
});

router.post('/remove', async(req, res) => {

  try{

    console.log(req.body,'addd');

    const email = req.body.email;
    const id = req.body.id.trim();
    

    const availCheck = await COURSE.findById(id);

    if(availCheck?.availableSeats > 0){

      const result = await COURSE.findByIdAndUpdate(id, { $pull: { registeredStudents: email }  });
      const result1 = await COURSE.findByIdAndUpdate(id, { $inc: { availableSeats: +1 } });

      res.status(200).json({
        success : true,
        mesage : 'Subscribed To Course SuccessFully'
      });

    } else {

      res.status(200).json({
        success : false,
        mesage : 'Course Were Filled'
      });

    }

    

   

  }catch (err){
    console.log('err:', err);

  }
});

// router.post('/getregisteredcourse', async(req, res) => {
// router.post('/registeruser', async(req, res) => {

//   const targetEmail = 'saravana@gmail.com';

//  const allRegesteredCOURSE = await COURSE.aggregate([
//         {
//           $match : { registeredStudents : targetEmail },
//         }
//  ]);  

//  console.log("👽 ~ router.post ~ allRegesteredCOURSE:", allRegesteredCOURSE)

  
// })

module.exports = router;
