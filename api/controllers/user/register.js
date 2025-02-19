const { renameTask } = require("grunt");
const { registerCustomQueryHandler } = require("puppeteer");

module.exports = {


  friendlyName: 'Register',


  description: 'Register user.',


  inputs: {
    fullName: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6,
    },
  },


  exits: {
    success: {
      statusCode: 201,
      description: 'New muna user created',
    },
    emailAlreadyInUse: {
      statusCode: 400,
      description: 'Email address already in use',
    },
    error: {
      description: 'Something went wrong',
    },

  },


  fn: async function (inputs,exits,env) {


    try{
      const newEmailAddress = inputs.email.toLowerCase();
      const token = await sails.helpers.strings.random('url-friendly');
      x= Date.now() + 24 * 60 * 60 * 1000;
      console.log(x,typeof(x));
      let newUser = await User.create({
        fullName: inputs.fullName,
        email: newEmailAddress,
        password: inputs.password,
        emailProofToken: token,
        emailProofTokenExpiresAt:
         x
         
      }).fetch();
      const confirmLink = `${sails.config.custom.baseUrl}/user/confirm?token=${token}`;
      const email = {
        to: newUser.email,
        subject: 'Confirm Your account',
        template: 'confirm',
        context: {
          name: newUser.fullName,
          confirmLink: confirmLink,
        },
      };
await sails.helpers.sendMail(email);
res= env.res
//   return exits.success({
//    message: `An account has been created for ${newUser.email} successfully. Check your email to verify`,
//  });
      return env.res.redirect("/archives/account_created.html")
    }
    catch (error){
        if (error.code === 'E_UNIQUE') 
        {
        // return exits.emailAlreadyInUse({
        //   message: 'Oops :) an error occurred',
        //   error: 'This email address already exits',
        // });
         // alert("email already exists");
         return env.res.redirect("/archives/error_emailalreadyexists.html")
        }
        else
        {
          return env.res.redirect("/archives/error_somethingwentwrong.html")
          //alert("Oops :) an error occurred");
        }
// return exits.error({
//   message: 'Oops :) an error occurred',
//   error: error.message,
// });

    }

    // All done.
   

  }
};
