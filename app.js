var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');



app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");
app.use(express.static("public"))



// DB connectivity
mongoose.connect("mongodb://localhost:27017/bonafide_v5", { useNewUrlParser: true, useUnifiedTopology: true })

// DB Schema
var studentSchema = new mongoose.Schema({
    name: String,
    id: String,
    gender: String,
    father: String,
    degree: String,
    branch: String,
    year: String
});

student = mongoose.model("student", studentSchema);

//Root Request
app.get("/", (req, res) => {
    res.render("index");
})

//Create Request
app.get("/create", (req, res) => {
    res.render("createNew")
})

//View Request
app.get("/view", (req, res) => {
    student.find({}, (err, result) => {
        res.render("view", { result: result })
    })

})

//Insert Request
app.get("/insert", (req, res) => {
    res.render("insert")
})


//For Deleting A Student's Record
app.post("/delete", (req, res) => {
    var id = req.body.id;

    student.findByIdAndDelete(id, function(err) {
        if (err) return handleError(err);
    });
    res.redirect("/view");

})



//For Bulk Uploading Of Student's Record
app.post("/insert", (req, res) => {
    resul = JSON.parse(req.body.element);
    arr = resul["Sheet1"];
    val = [];
    arr.forEach((element) => {
        student.findOneAndRemove({ id: element.id }, (err) => {
            if (err) {
                console.log(err)
            } else {

            }
        })

    })
    for (var i = 0; i < arr.length; i++) {
        student.create(arr[i], (err, createdStudent) => {
            if (err) {
                console.log(err);
            } else {
                console.log("Student Created:", createdStudent);
            }

        })
    }


    res.redirect("/view")
})


//For  Creating A Single Student Record
app.post("/create", (req, res) => {
    console.log(req.body)
    if (req.body.name == undefined || req.body.id == undefined || req.body.gender == undefined || req.body.father == undefined || req.body.degree == undefined || req.body.branch == undefined || req.body.year == undefined) {
        res.render("error", { message: "Enter all the Fields", path: "/create", symbol: "fa fa-backward" })
    } else {

        var name = req.body.name;
        id = req.body.id,
            gender = req.body.gender,
            father = req.body.father;
        degree = req.body.degree;
        branch = req.body.branch;
        year = req.body.year;

        var newStudent = { name: name, id: id, gender: gender, father: father, degree: degree, branch: branch, year: year }
        student.find({ id: id }, (err, result) => {
            if (err) {
                res.render("error", { message: "Can't Create New Student", path: "/create", symbol: "fa fa-backward" })
            }

            if (result.length > 0) {
                var name, father, degree, branch, gender;
                name = result[0].name;
                sid = result[0].id;
                father = result[0].father;
                degree = result[0].degree;
                branch = result[0].branch;
                gender = (result[0].gender == "Male") ? "MR." : "Ms."
                year = result[0].year;

                res.render("duplicate", { name: name, id: sid, gender: gender, father: father, degree: degree, branch: branch, year: year })
            } else {

                student.create(newStudent, (err, createdStudent) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(createdStudent);
                    }

                })
                res.redirect("/view")
            }
        })



    }

})


//For Editing the Student's Record
app.post("/edit", (req, res) => {
    var id = req.body.id;

    student.find({ _id: id }, (err, result) => {

        if (result[0] != undefined) {

            var name, father, degree, branch, gender;
            name = result[0].name;
            sid = result[0].id;
            father = result[0].father;
            degree = result[0].degree;
            branch = result[0].branch;
            gender = (result[0].gender == "Male") ? "MR." : "Ms."
            year = result[0].year;

            res.render("edit", { name: name, id: sid, gender: gender, father: father, degree: degree, branch: branch, uid: id, year: year })
        }

    })

})


app.post("/confirm", (req, res) => {
    console.log(req.body)

    if (req.body.id != undefined) {
        var id = req.body.id;

        student.find({ id: id }, (err, result) => {

            if (result[0] != undefined) {

                var name, father, degree, branch, gender;
                name = result[0].name;
                father = result[0].father;
                degree = result[0].degree;
                branch = result[0].branch;
                gender = (result[0].gender == "Male") ? "MR." : "Ms."
                year = result[0].year;


                res.render("confirm", { name: name, id: id, gender: gender, father: father, degree: degree, branch: branch, year: year })
            } else {
                res.render("error", { message: "Enter A Valid Student ID", path: "/", symbol: "fa fa-home" })
            }

        })
    } else {
        var id = req.body.idview;

        student.find({ _id: id }, (err, result) => {

            if (result[0] != undefined) {

                var name, father, degree, branch, gender;
                sid = result[0].id;
                name = result[0].name;
                father = result[0].father;
                degree = result[0].degree;
                branch = result[0].branch;
                gender = (result[0].gender == "Male") ? "MR." : "Ms."
                year = result[0].year;


                res.render("confirm", { name: name, id: sid, gender: gender, father: father, degree: degree, branch: branch, year: year })
            }

        })
    }


});

// FOR EDITING A STUDENT'S DETAIL  
app.post("/update", (req, res) => {

    if (req.body.name == undefined || req.body.id == undefined || req.body.gender == undefined || req.body.father == undefined || req.body.degree == undefined || req.body.father == undefined) {
        res.render("error", { message: "Enter all the Fields", path: "/view", symbol: "fa fa-backward" })
    } else {


        var uid = req.body.element;

        var name = req.body.name;
        id = req.body.id,
            gender = req.body.gender,
            father = req.body.father;
        degree = req.body.degree;
        branch = req.body.branch;
        year = req.body.year;


        student.updateOne({ _id: uid }, { $set: { name: name, id: id, gender: gender, father: father, degree: degree, branch: branch, year: year } }, (err, updated) => {
            if (err) {
                console.log(err);
            } else {
                console.log(updated);
            }
        })

        res.redirect("/view")

    }

})

app.post("/print", (req, res) => {

    var id = req.body.id;
    student.find({ id: id }, (err, result) => {

        var name, father, degree, branch, gender;
        name = result[0].name;
        father = result[0].father;
        degree = result[0].degree;
        branch = result[0].branch;
        gender = (result[0].gender == "Male") ? "MR." : "Ms."
        year = result[0].year;

        var today = new Date();
        var date = today.getDate() + '.' + (today.getMonth() + 1) + '.' + today.getFullYear();
        var currentYear = today.getFullYear();

        var month = today.getMonth();
        if (month < 4) {
            currentYear -= 1;
        }
        console.log(currentYear - year)
        switch (currentYear - year + 1) {
            case 1:
                sYear = "First";
                break;
            case 2:
                sYear = "Second";
                break;
            case 3:
                sYear = "Third";
                break;
            default:
                sYear = "Fourth";

        }

        res.render("print", { date: date, sYear: sYear, currentYear: currentYear, name: name, id: id, gender: gender, father: father, degree: degree, branch: branch })

    })



})


app.listen(3000, (req, res) => {
    console.log("Bonifide Application Started");
})