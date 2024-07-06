const ProjectList=require('../models/projectModel');
// controller for main page or home page
module.exports.home= async function(req,res){
    try {
       const projectDet = await ProjectList.find({});
       return res.render('home',{
        project:projectDet,
        title:'home page'
    });
}
catch (err) {
    console.log('error', err);
    return res.status(500).send('An error occurred while fetching project details.');
    }
}