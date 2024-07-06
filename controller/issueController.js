const IssueList = require('../models/issue');
const ProjectList = require('../models/projectModel');

// Issue page controller
module.exports.issuepage = async function(req, res) {
    try {
        const projectDetail = await ProjectList.findById(req.params.projectId);
        console.log(req.params, "pp");
        return res.render('issuePage', {
            title: 'create issue',
            projectId: req.params.projectId,
            projectDet: projectDetail
        });
    } catch (err) {
        console.error('Error fetching project details:', err);
        return res.status(500).send('An error occurred while fetching project details.');
    }
};

// Create issue
module.exports.create = async function(req, res) {
    try {
        console.log('issue req.body', req.body);
        let newIssue = await IssueList.create({
            title: req.body.title,
            description: req.body.description,
            author: req.body.author,
            projectRef: req.body.projectRef,
            labels: req.body.labels
        });

        let project = await ProjectList.findById(req.body.projectRef);
        project.issue.push(newIssue);
        await project.save();

        console.log('Issue is created successfully', newIssue);
        return res.redirect("/");
    } catch (err) {
        console.error('Error creating issue:', err);
        return res.status(500).send('An error occurred while creating the issue.');
    }
};


// Filter the issue
module.exports.filterIssue = async function(req, res) {
    try {
        console.log(req.body, "req.body");
        let projectData = await ProjectList.findById(req.body.projectId).populate('issue');
        console.log("projectData", projectData);
        console.log('kk', projectData.issue);

        let filterdata = new Set();
        console.log('kjhuhk', filterdata);

        if (req.body.searchAuthor) {
            for (let issue of projectData.issue) {
                if (issue.author === req.body.searchAuthor) {
                    filterdata.add(issue);
                }
            }
        } else if (req.body.searchTitleDesc) {
            for (let issue of projectData.issue) {
                if (issue.title === req.body.searchTitleDesc || issue.description === req.body.searchTitleDesc) {
                    filterdata.add(issue);
                }
            }
        } else {
            for (let issue of projectData.issue) {
                for (let label of issue.labels) {
                    console.log(label, "kljk");
                    if (label === req.body.label1 || label === req.body.label2) {
                        filterdata.add(issue);
                    }
                }
            }
        }

        let issueRleToPro = await IssueList.find({ projectRef: req.body.projectId });
        console.log('lkk', issueRleToPro);

        return res.render('projectDetailsPage', {
            title: 'filter issue',
            showIssue: false,
            filterdata: Array.from(filterdata), // Convert Set to Array
        });
    } catch (err) {
        console.error('Error filtering issues:', err);
        return res.status(500).send('An error occurred while filtering issues.');
    }
};
