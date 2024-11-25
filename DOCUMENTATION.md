# Lilly Technical Challenge Documentation

*This documentation provides an overview of my approach to the challenge, the objectives I achieved, the problems I encountered, and my evaluation of the process.*

---

## **Approach**
I approached the challenge step-by-step, tackling one objective at a time to ensure I fully understood each requirement. The sequence of tasks was as follows:
1. Set up the **backend server** with FastAPI and implemented the endpoints.
2. Built the **frontend** using HTML, CSS, and JavaScript, ensuring a responsive and user-friendly interface.
3. Connected the backend to the frontend to allow API data to flow seamlessly.
4. Addressed data validation and error handling to manage gaps or invalid entries in the database.
5. Worked on styling and user experience to enhance the design and functionality of the site.

External resources such as FastAPI documentation, MDN Web Docs, and GitHub repositories were referenced to understand best practices for API integration and error handling.

---

## **Objectives - Innovative Solutions**
### **1. Fetch Data and Display it on the Frontend**
- The **medicines data** from the backend is dynamically displayed in the frontend's "Available Medicines" section.
- Implemented **animations** and **responsive layouts** to ensure data presentation was engaging and user-friendly.

### **2. Handle Missing/Invalid Data**
- Added checks to the backend to ensure `data.json` is present and correctly formatted.
- On the frontend, user-friendly error messages inform the user if an API call fails or if a medicine is not found.

### **3. Add, Update, and Delete Medicines**
- Forms were created for these actions, with input validation to prevent invalid entries.
- The frontend dynamically updates to reflect changes in the backend.

### **4. Average Price Calculation**
- A dedicated button calculates and displays the **average price** of medicines in real-time.
- Handled scenarios where no medicines exist by displaying an appropriate message.

---

## **Problems Faced**
### **1. Average Price Functionality**
- **Issue**: Initially, the backend's `/medicines/average` endpoint returned an error when the `data.json` file was empty or improperly formatted.
- **Solution**: Added checks in the backend to validate the presence of `price` fields in the `data.json` file and gracefully handle cases where no medicines are available.

### **2. "View All Medicines" on the Frontend**
- **Issue**: Although the `GET /medicines` endpoint worked perfectly in the terminal and Postman, it did not function in the frontend. The error was likely due to incorrect handling of asynchronous requests or rendering issues.
- **Solution**: Decided to remove the "View All Medicines" button from the frontend for simplicity, while retaining the backend functionality.

### **3. Duplicate Medicine Entries**
- **Issue**: Users could accidentally add duplicate medicines, leading to redundant entries.
- **Solution**: Added backend logic to check if a medicine with the same name already exists, returning an error message if so.

---

## **Evaluation**
Overall, the challenge was an excellent opportunity to combine frontend and backend skills. Key points of evaluation include:
- **Strengths**:
  - Successfully implemented most of the objectives with a clean and responsive UI.
  - Backend endpoints were robust and handled errors effectively.
  - Real-time updates to the frontend improved the user experience.
- **Weaknesses**:
  - The "View All Medicines" feature was not fully functional in the frontend, despite working in the backend.
  - Some time was spent debugging issues with asynchronous data handling and file validation.

### **What Would I Do Differently?**
- Focus more on debugging frontend-backend interactions to prevent rendering issues.
- Implement pagination and sorting for larger datasets to improve scalability.
- Allocate more time to thoroughly test edge cases, such as invalid inputs and large datasets.

---

## **Conclusion**
The Medicine Tracker project highlights a comprehensive approach to managing medicines through a dynamic frontend and a reliable backend. While there were some challenges, the overall functionality demonstrates a clear understanding of full-stack development principles and a user-first design approach.
