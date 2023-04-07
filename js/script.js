class CourseSelectionView {
  constructor() {
    this.selectionForm = document.querySelector(".course-selection__form");
    this.availableCourseList = document.querySelector(".course__list--available");
  }

  renderCourseLists(courseList) {
    this.availableCourseList.innerText="";
    console.log("available course list", courseList);
    courseList.forEach((course) => {
      const courseItem = this.createCourseElement(course);
      this.availableCourseList.appendChild(courseItem);
    })
  }

  createCourseElement(newCourse) {
    const courseElem = document.createElement("div");
    const courseName = document.createElement("div");
    courseName.innerText = newCourse.courseName;
    const courseType = document.createElement("div");
    courseType.innerText = `Course Type: ${newCourse.required ? "Compulsory" : "Elective"}`;
    const courseCredit = document.createElement("div");
    courseCredit.innerText = `Course Credit: ${newCourse.credit}`;
    courseElem.appendChild(courseName);
    courseElem.appendChild(courseType);
    courseElem.appendChild(courseCredit);

    return courseElem;
  }
}

class CourseSelectionModel {
  #courseList;
  constructor() {
    this.#courseList = [];
  }

  async fetchCourseList() {
    const courseList = await API.getCourseList();
    this.courseList = courseList;
    return courseList;
  }
}

class CourseSelectionController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.init();
  }

  init() {
    this.model.fetchCourseList().then(() => {
      const courseList = this.model.courseList;
      this.view.renderCourseLists(courseList);
    });
  }
}

// create instances of classes
const app = new CourseSelectionController(new CourseSelectionModel(), new CourseSelectionView());
