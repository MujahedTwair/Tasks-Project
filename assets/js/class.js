
let tasksList = document.getElementById('tasks-ul');
export class Task{
    static count = 0 ;
    constructor(title, status = false){
        this.title = title;
        this.status = status;
        this.id = `task${this.id}`;
        Task.count++;
    }

    draw () {
        let li = document.createElement('li');
        li.classList.add('ul-li');
        li.dataset['status'] = this.status;
        li.dataset['id'] = this.id;
        
        if (this.status == 'true') {
            this.status = String('checked');
        } else {
            this.status = String('');
        }
        li.innerHTML = `    
            <label class ="container">
                <input type="checkbox" form="myform" id="${this.id}" class="checkbox" ${this.status}>
                <span class="checkmark"></span>
                <div class="title">${this.title}</div>
            </label>
            <i class="fa-solid fa-ellipsis options-icon" data-id="${this.id}"></i>  
            `
        tasksList.append(li);
    }
    remove(){
        for(let ele of tasksList.children){
            if (ele.dataset.id = this.id)
                ele.remove();
        }
    }
}

class StorageManegment{
    update(){};
    get(){};
}

export class LocalStorageManegment extends StorageManegment {
    update(){
        let tasks = [];
        for(let ele of tasksList.children){
            let task = new Task(ele.children[0].children[2].innerHTML, ele.dataset.status);
            tasks.push(task);
        }
        localStorage.setItem('tasks',JSON.stringify(tasks));
    }
    get(){
        if(JSON.parse(localStorage.getItem('tasks'))){
            let tasks = JSON.parse( localStorage.getItem('tasks') );
            tasks.forEach ((element) =>{
                let task = new Task(...Object.values(element));
                
                task.draw();
            })    
        }else {
            localStorage.setItem('tasks',null);
        }
    }
    clear(){
        localStorage.setItem("tasks", null);
    }    
}
