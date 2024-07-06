const ProjectList=require('../models/projectModel');
const IssueList=require('../models/issue');


module.exports.createProject=function(req,res){
      return res.render('createproject',{
        title:"create project"
    })
}

// Create Project
module.exports.create = async function(req, res) {
    try {
        console.log("req.body", req.body);
        let project = await ProjectList.create({
            projectname: req.body.projectname,
            projectauthor: req.body.projectauthor,
            projectdescription: req.body.projectdescription
        });
        console.log('Project is created successfully', project);
        return res.redirect('/');
    } catch (err) {
        console.error('Error in creating project', err);
        return res.status(500).send('An error occurred while creating the project.');
    }
};

// Project Issue Details
module.exports.projectIssue = async function(req, res) {
    try {
        console.log('req.query.projectid', req.query.projectid);
        let project = await ProjectList.findById(req.query.projectid);
        let issuePro = await IssueList.find({ projectRef: req.query.projectid });
        console.log("project", project);
        console.log("issuePro", issuePro);

        let uniqueArray = [];
        for (let i of issuePro) {
            for (let j of i.labels) {
                uniqueArray.push(j);
            }
        }

        let uniqueSet = [...new Set(uniqueArray)];
        console.log('uniqueSet', uniqueSet);

        return res.render('projectDetailsPage', {
            project: project,
            issue: issuePro,
            labelSet: uniqueSet,
            showIssue: true,
            title: 'Project Details Page'
        });
    } catch (err) {
        console.error('Error fetching project issues', err);
        return res.status(500).send('An error occurred while fetching project issues.');
    }
};
