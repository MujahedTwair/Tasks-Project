// import { Task, LocalStorageManegment } from "./class.js";

let taskInput = document.getElementById("task-input");
let addBtn = document.getElementById('add-btn');
let menu = document.getElementById("contextMenu"); 
let completeLink = document.getElementById('complete');
let deleteLink =  document.getElementById('delete');
let tasksList = document.getElementById('tasks-ul');
let clearBtn = document.getElementById('clear-btn');
let allTap = document.getElementById('all-tab');
let pendingTap = document.getElementById('pending-tab');
let completedTap = document.getElementById('completed');
let taps = document.getElementById('taps');
let tapBtns = document.querySelectorAll('#taps .tap');

// for drag drop
let sortableList = document.querySelector(".tasks-ul");
let items = sortableList.querySelectorAll(".ul-li");

class Task {
    static count = 0;
    constructor(title, status = false, id) {
        this.title = title;
        this.status = status;
        this.id = id;   
        Task.count++;
    }

    draw() {
        let li = document.createElement('li');
        li.classList.add('ul-li');
        li.dataset['status'] = this.status;
        li.dataset['id'] = this.id;
        li.draggable = 'true';

        if (this.status == 'true') {
            this.status = String('checked');
        } else {
            this.status = String('');
        }
        li.innerHTML = `    
            <i class="fa-solid fa-grip-vertical light-opacity"></i>
            <label class ="container">
                <input type="checkbox" form="myform" id="${this.id}" class="checkbox" ${this.status}>
                <span class="checkmark"></span>
                <div class="title">${this.title}</div>
            </label>
            <i class="fa-solid fa-ellipsis options-icon" data-id="${this.id}"></i>  
            `
        tasksList.append(li);
    }
    remove() {
        for (let ele of items) {
            if (ele.dataset.id = this.id)
                ele.remove();
        }
    }
}

class StorageManegment {
    update() { };
    get() { };
}

class LocalStorageManegment extends StorageManegment {
    update() {
        let tasks = [];
        for (let ele of items) {
            let task = new Task(ele.children[1].children[2].innerHTML, ele.dataset.status, ele.dataset.id );
            tasks.push(task);
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    get() {
        if (JSON.parse(localStorage.getItem('tasks'))) {
            let tasks = JSON.parse(localStorage.getItem('tasks'));
            tasks.forEach((element) => {
                let task = new Task(...Object.values(element));
                task.draw();
            })
        } else {
            localStorage.setItem('tasks', null);
        }
    }
    clear() {
        localStorage.setItem("tasks", null);
    }
}

let myLocalStorage = new LocalStorageManegment();

    
myLocalStorage.get();
hideShowItems();
let contexts;
window.onload = function() { 
    contexts = document.querySelectorAll('.tasks-ul > li > i.options-icon ');
};



taskInput.addEventListener('keyup',() => {
    addBtn.style.display = 'block';
    if(taskInput.value == ''){
    addBtn.style.display = 'none';
    }
});



function hideMenu() { 
    menu.style.animation = "hide .1s ease-out" ;
    menu.style.opacity = '0';
    menu.style.visibility = 'hidden';
} 

function displayMenu(e, id) { 
    e.preventDefault();
    console.log( e.target )
    e = e.target ;

    menu.style.display = 'block';
    menu.style.left = e.offsetLeft + 20 + "px";
    menu.style.top = e.offsetTop - 10 + "px";
    menu.style.animation = 'show 0.4s ease-out'
    menu.style.opacity = '1';
    menu.style.visibility = 'visible';
    menu.dataset.currentId = id;   
} 

completeLink.addEventListener('click',(e)=>{
    e.preventDefault();
    let inputId = completeLink.parentElement.parentElement.parentElement.getAttribute('data-current-id');
    let checkbox = document.getElementById(inputId);
    checkbox.checked = true ;
    checkbox.setAttribute('checked','');
    document.querySelector(`li[data-id = ${inputId}]`).dataset.status = true;
    myLocalStorage.update();
});

deleteLink.addEventListener('click',(e)=>{
    e.preventDefault();
    let inputId = deleteLink.parentElement.parentElement.parentElement.getAttribute('data-current-id');
    document.querySelector(`li[data-id = ${inputId}]`).remove();
    hideShowItems();
    myLocalStorage.update();
});

function updateSelctors(){
    let inputs = document.querySelectorAll('.checkbox');
    for(let input of inputs){
        input.addEventListener('change', (event) => {
            event.preventDefault();
            input.parentElement.parentElement.dataset.status = input.checked;
            hideShowItems();
            myLocalStorage.update();
        })
    }
    contexts = document.querySelectorAll('.tasks-ul > li > i.options-icon ');
    updateItemsListeners();
    
}
updateSelctors();

addBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    if(!taskInput.value){
        return;
    }
    let id =`task${new Date().getTime() + Math.random().toString().slice(2,10)}` 
    let newTask = new Task(taskInput.value,false,id);
    newTask.draw();
    hideShowItems();
    myLocalStorage.update();
    taskInput.value = '';
    addBtn.style.display = 'none';
    updateSelctors();
    // alert('Task added successfully');
})


clearBtn.addEventListener('click', (event) => {
    if(!confirm('Are you sure to delete all tasks?')){
        return;
    }
    event.preventDefault();
    items.forEach((element) => element.remove());
    hideShowItems();
    myLocalStorage.clear();    
})

document.onclick = function(event){
    hideMenu(); 
    for(let ele of contexts){
        
        if (event.target == ele){
            let id = ele.dataset.id;
            displayMenu(event, id);
            return;
        }
    }     
};


function hideShowItems(){
    let activeBtn = taps.dataset.activeBtn;
    let lastElement;
    items = sortableList.querySelectorAll(".ul-li"); 
    let emptyDiv = document.getElementById('emptyDiv');
    switch (activeBtn) {
        case completedTap.innerHTML:
            
           for(let element of items){
                if (element.dataset.status == 'false'){
                    element.classList.add('hide');
                } else {
                    element.classList.remove('hide');
                    element.classList.remove('hide-border-bottom');
                    lastElement = element;
                }
                
            }
  
            break;
        case pendingTap.innerHTML:

            for(let element of items){
                console.log(element.dataset.status);
                if (element.dataset.status == 'true'){
                    element.classList.add('hide');
                } else {
                    element.classList.remove('hide');
                    element.classList.remove('hide-border-bottom');
                    lastElement = element;
                }   
            }
            
            break;
            
        default:
            for(let element of items){
                element.classList.remove('hide');
                element.classList.remove('hide-border-bottom');
                lastElement = element;
            }
            
            break;
    }
    if(lastElement){
        lastElement.classList.add('hide-border-bottom');
        emptyDiv.style.display = 'none';
    } else {
        emptyDiv.style.display = 'block';
    }

}

for(let tap of tapBtns){
    tap.addEventListener('click', myTabClicks);
}

function myTabClicks(tabClickEvent){ 
    tabClickEvent.preventDefault();
    for (let tap of tapBtns) {  
        tap.classList.remove("active-tap");
    }
    let clickedTab = tabClickEvent.target;
    clickedTab.classList.add("active-tap");

    taps.dataset.activeBtn = clickedTab.innerHTML;
    hideShowItems();
    tabClickEvent.preventDefault();   
}


// for (let task of tasksList.children) {
    
//     task.onmousedown = function (event) {
//         let shiftX = event.clientX - task.getBoundingClientRect().left;
//         let shiftY = event.clientY - task.getBoundingClientRect().top;
//         // (1) prepare to moving: make absolute and on top by z-index
//         task.style.position = 'absolute';
//         task.style.zIndex = 1000;

//         // move it out of any current parents directly into body
//         // to make it positioned relative to the body
//         document.body.append(task);

//         // centers the task at (pageX, pageY) coordinates
//         function moveAt(pageX, pageY) {
//             task.style.left = pageX - shiftX + 'px';
//             task.style.top = pageY - shiftY + 'px';
//         }

//         // move our absolutely positioned task under the pointer
//         moveAt(event.pageX, event.pageY);

//         function onMouseMove(event) {
//             moveAt(event.pageX, event.pageY);
//         }

//         // (2) move the task on mousemove
//         document.addEventListener('mousemove', onMouseMove);

//         // (3) drop the task, remove unneeded handlers
//         task.onmouseup = function () {
//             document.removeEventListener('mousemove', onMouseMove);
//             task.onmouseup = null;
//         };

//     };
//     task.ondragstart = function () {
//         return false;
//     };
// }


// Drag Drop
function updateItemsListeners(){
    sortableList = document.querySelector(".tasks-ul");
    items = sortableList.querySelectorAll(".ul-li");
    items.forEach(item => {
        item.addEventListener("dragstart", () => {
            // Adding dragging class to item after a delay
            console.log('hello');
            setTimeout(() => item.classList.add("dragging"), 0);
        });
        // Removing dragging class from item on dragend event
        item.addEventListener("dragend", () => {
            item.classList.remove("dragging")
            hideShowItems();
            myLocalStorage.update();
        });
    });
}


const initSortableList = (e) => {
    e.preventDefault();
    let draggingItem = document.querySelector(".dragging");
    // Getting all items except currently dragging and making array of them
    let siblings = [...sortableList.querySelectorAll(".ul-li:not(.dragging)")];

    // Finding the sibling after which the dragging item should be placed
    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });

    // Inserting the dragging item before the found sibling
    // console.log(draggingItem);
    sortableList.insertBefore(draggingItem, nextSibling);
}
updateItemsListeners();
sortableList.addEventListener("dragover", initSortableList);
sortableList.addEventListener("dragenter", e => e.preventDefault());






