// use an IIFE function to create a closure and encapsulate the implementation details of the API module
// it creates a new scope for the code to run in
const API = (() => {
  const API_URL = "http://localhost:3000/courses";

  const getCourse = async (id) => {
    // run `json-server db.json --id courseId` before start
    const res = await fetch(`${API_URL}/${id}`);
    return await res.json();
  }

  const getCourseList = async () => {
    const res = await fetch(API_URL);
    return await res.json();
  }

  const updateCourse = async (id, newCourse) => {
    // append id to url to specify which item to modify
    // run `json-server db.json --id courseId` before start
    const res = await fetch(`${API_URL}/${id}`, {
      // replace the original course data
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCourse)
    })
    return await res.json();
  }

  return {
    getCourseList,
    updateCourse,
    getCourse
  }
})();

// async function example() {
//   const newCourse = {
//     "courseId": 1,
//     "courseName": "Calculus",
//     "required": true,
//     "credit": 3
//   };
//   API.updateCourse(1, newCourse).then(updatedCourse => {
//     console.log("updated", updatedCourse);
//   })
//   API.getCourseList().then(courses => {
//     console.log(courses);
//   })
// }
// example();