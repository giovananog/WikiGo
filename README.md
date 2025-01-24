<p align="center"> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg" alt="Spring Boot Icon" width="40px"/> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React Icon" width="40px"/> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" alt="Java Icon" width="40px"/> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript Icon" width="40px"/> <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elasticsearch/elasticsearch-original.svg" alt="ElasticSearch Icon" width="40px"/> </p>

# **WikiGo - ElasticSearch search engine**

Wiki Go is a search engine that enables users to find articles and other information using various filters and advanced search functionalities. Developed as part of the Introduction to ElasticSearch at Universidade Federal de Alfenas, this project demonstrates the power of ElasticSearch in combination with modern web development frameworks.

<br>
   
## **Table of Contents**
1. [Overview](#overview)
2. [Technologies Used](#technologies-used)
3. [User Interface](#user-interface)
4. [Usage](#usage)
5. [Project Structure](#project-structure)
6. [API Endpoints](#api-endpoints)
7. [Examples of Queries](#examples-of-queries)
8. [Contributors](#contributors)

<br>

## **Overview**
Wiki Go provides an intuitive interface for searching and retrieving content efficiently. Leveraging ElasticSearch, the project highlights:

- Fast and scalable search capabilities.
- Integration of keyword highlighting and advanced filtering.
- A seamless experience between the backend (Java) and the frontend (React).

This project was created to demonstrate proficiency in ElasticSearch and full-stack development.

<br>

## **Technologies Used**
- **ElasticSearch**: For storing and indexing data.
- **Java**: Backend development with **Spring Boot**.
- **React**: Frontend development with a responsive design.
- **Axios**: For managing HTTP requests between the frontend and backend.
- **HTML/CSS/JavaScript**: Core web technologies for UI implementation.

<br>

## **User Interface**
<br><br>
<img src="https://github.com/giovananog/WikiGo/blob/main/frontend_wikigo-main/frontend/public/wikigo%20-%20home.jpeg" alt="Wiki Go Home Page" width="880px">
>WikiGo home page

<br>

## **Usage**
The Wiki Go search engine provides a user-friendly interface to search and filter articles. Users can:

- Input keywords in the search bar.
- Apply filters such as publication date, category, and tags.
- View highlighted keywords in search results for better readability.

<br>

## **Project Structure**

The project is organized as follows:

- **`backend/`**: Contains the Java Spring Boot application that interacts with ElasticSearch.
  - **Controllers**: Handle incoming HTTP requests.
  - **Services**: Contain business logic.
  - **Repositories**: Define ElasticSearch queries.

- **`frontend_wikigo-main/`**: Contains the React application for the user interface.
  - **Components**: Modular UI elements.
  - **Pages**: Define the layout of key pages like the search and result pages.

<br>

## **API Endpoints**

### Base URL
The backend runs on `/api` by default.

### Endpoints
- **GET** `/search`
  - **Description**: Retrieves search results based on query parameters.
  - **Query Parameters**:
    - `query`: The search keyword(s).
    - `page`: Page number to be returned.
    - `filters`: Optional filters (e.g., category, date).
  - **Example**:
    ```bash
    curl -X GET "http://localhost:8080/api/search?query=exampleQuery&page=1&filter=filter1&filter=filter2"
    ```

<br>

## **Examples of Queries**

### Example 1: Filtered Search
```bash
GET "http://localhost/api/search?query=machine+learning&page=2" 
```
**Response**:
```json
[
  {
    "abs": "Machine Learning Article 1 example.",
    "title": "Machine Learning introduction",
    "url": "https://example.com/machine-learning-introduction"
  },
  {
    "abs": "Machine Learning Article 2 example.",
    "title": "Machine is Learning",
    "url": "https://example.com/machine-is-learning"
  }
]

```

<br>

## **Supported Filters**

### **1. No Filters (Basic Search)**  
Executes a basic search query without applying any filters.  
**Endpoint**: `/search`  
**Description**: Retrieves results based on the provided query string.

- **Example**:  
  ```bash
  GET /api/search?query=example&page=1
  ```

---

### **2. Search with `AND` Operator**  
Searches with all terms required in the content.  
**Endpoint**: `/search`  
**Description**: Uses the `AND` operator to ensure all terms match.  

- **Example**:  
  ```bash
  GET /api/search?query=example&filter=and&page=1
  ```

---

### **3. Exclude Terms (Must Not)**  
Filters out results containing specific terms.  
**Endpoint**: `/search`  
**Description**: Excludes content that matches the specified terms.

- **Example**:  
  ```bash
  GET /api/search?query=example&filter=must_not:excluded_term&page=1
  ```

---

### **4. Filter by Creation Date (`dt_creation`)**  
Filters results based on a range of creation dates.  
**Endpoint**: `/search`  
**Description**: Use comparison operators (`lt`, `gte`) with a date.

- **Parameters**:  
  - `lt`: Less than  
  - `gte`: Greater than or equal to  

- **Example**:  
  ```bash
  GET /api/search?query=example&filter=dt_creation:lt:2023-01-01&page=1
  GET /api/search?query=example&filter=dt_creation:gte:2023-01-01&page=1
  ```

---

### **5. Filter by Reading Time (`reading_time`)**  
Filters results based on the reading time of the content.  
**Endpoint**: `/search`  
**Description**: Filters based on a range of reading times using `lt` or `gte`.

- **Parameters**:  
  - `lt`: Less than  
  - `gte`: Greater than or equal to  

- **Example**:  
  ```bash
  GET /api/search?query=example&filter=reading_time:lt:10&page=1
  GET /api/search?query=example&filter=reading_time:gte:5&page=1
  ```

---

### **6. Fuzzy Search**  
Executes a fuzzy search to find matches with slight variations.  
**Endpoint**: `/search`  
**Description**: Allows minor differences in the query, such as typos.

- **Example**:  
  ```bash
  GET /api/search?query=exmple&filter=fuzziness:2&page=1
  ```

---

## **Highlighting Results**  
All searches support highlighting of matched content. By default, results include highlighted terms enclosed in `<strong>` tags.

**Example Response**:  
```json
[
  {
    "abs": "This is a <strong>highlighted</strong> result.",
    "title": "Highlighted Title",
    "url": "https://example.com/result"
  }
]
```
<br>

## **Contributors**

<table align='center'>
  <tr>
    <td align="center">
      <a href="https://github.com/giovananog">
        <img src="https://avatars.githubusercontent.com/u/114829638?v=4" width="150px;"/><br>
        <sub><b>Giovana Nogueira</b></sub>
      </a>
       <sub><p>backend</p></sub>
    </td>
    <td align="center">
      <a href="https://github.com/Dogolaa">
        <img src="https://avatars.githubusercontent.com/u/71687738?v=4" width="150px;"/><br>
        <sub><b>Lucas Dogo</b></sub>
      </a>
       <sub><p>frontend</p></sub>
    </td>
  </tr>
</table>


