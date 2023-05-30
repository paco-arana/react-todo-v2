# To Do App Client

## How to run

To keep the file size small the node_module folder has been removed. In order to reinstall it, open a terminal and run the following command in this folder, where the README.md is located:

```
npm install
```

From then the client can be run in the 8080 port using:

```
npm start
```

There are only two basic unit tests, they can be run using:

```
npm test
```

The client can have issues running with Zscaler active, you can temporarily disable it to run.

---

## About <a name="about"></a>

You are working with a client that needs to implement a to do list to help manage their tasks in their daily job. The client asked you to implement the following functionality:

- Create a “to do” specifying the name, a priority, and possibly a due date

- Ability to edit name, priority and due date for existing “to do” tasks

- They want to be able to specify a due date or clear the due date (because they are not interested in when to finish that “to do”).

- Be able to filter “to do’s” specifying the name (or part of the name), and the priority, and if they are done/undone.

- Be able to sort the “to do’s” by priority and/or due date. For example, be able to sort items where their due date is soon and sort them also by priority to see what tasks are more urgent or less urgent.

- Mark “to do’s” as done (clicking in a checkbox) or to undone a “to do”. The undone functionality is just there if there is a mistake :D

- Since it is possible that the client will have a lot of “to do’s” they need to paginate the list of “to do’s”.

- Ability to know, in average, the time between creation and done for all “to do’s”. This should be shown in general for all done “to do’s” and also grouped by priority. This is important for the client since this is a metric they follow to measure performance.

## UI Requirements

The UX/UI Team of the client is asking you to conform with the following markup to design the app.

1. Search/Filtering Controls

2. New To Do Button. This should open a modal to type the “to do” data.

3. Priority column should show in the header the classic up and down arrows to allow the user to sort.

4. Due date column should show in the header the classic up and own arrows to allow the user to sort.

5. Action column to show actions (links/buttons) to allow the user to delete or edit a “to do”. To Edit is ok to show a modal similar to the one to create a “to do”.

6. Pagination control. Showing the pages, its number and the next and previous page is enough.

7. Area to show the metrics.

### Nice to have for the UI

Show the row with background colors depending on the due date:

- No due date – No background color

- One week between due date and today – Red background color

- 2 weeks between due date and today – Yellow background color

- More that 2 weeks between due date and today – Green background color

Strikethrough fonts for those tasks marked as done

# Front-end Technology

For the front-end project, you have to use:

- JavaScript

- ReactJS

- Up to you to use Redux or React Context

They need at least the following commands to run the project:

- npm run start – To run the front-end application

- npm run tests – To run all tests in the front-end application

Front end project must run in port 8080.
