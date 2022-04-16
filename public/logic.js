//Глобальные переменные
const url =  new URL("http://95.213.224.23:3000/");
var id_stock;
var countS;

//Функции

//Регистрация профиля
function register(){
    
    var data = {
        name: PharmName.value,
        phone: PharmPhone.value,
        adress: PharmAdress.value,
        login: PharmLogin.value,
        password: PharmPassword.value
    };

    fetch (url + 'register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
    });

    alert("Профиль зарегестирован!");
};


//Приход лекарственных средств
function addToStock(){

    //Получение уникального кода аптеки    
    let id_pharm = localStorage.getItem("id_pharmacies");
    
    var data = {
        id_medecine: medecineSelect.value,
        id_parametr: parametrSelect.value,
        id_pharmacies: id_pharm,
        count: count.value
    };

    fetch (url + 'newStock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
    });

    
    loadTableData();

};


//Уход лекарственных средств
function deleteFromStock(){

    if (careCount.value >  countS) {
        alert("У вас нет столько лекарств!");
        return;
    }
    
    var data = {
        id_stock: id_stock,
        count: careCount.value
    };

    fetch (url + 'deleteStock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
    });

    
    loadTableData();

};


//Вход в профиль
function login() {
    
    const loginInput = document.getElementById("loginInput");
    const passwordInput = document.getElementById("passwordInput");
    
    fetch(url + "login?login="+loginInput.value+"&pass="+passwordInput.value).then(function(response) {
        response.json().then(function(data) {
            if (data.length == 0) {
                alert('Неверные данные!')
                return
            } 
            localStorage.setItem("id_pharmacies", data[0].id_pharmacies);
            window.location.href = "pharm.html";
        });
    });

}


//Заполняем категории в терминале
function getCategoryFilter(){
    fetch(url + "category").then(function(response) {
        response.json().then(function(data) {
            for (var i=0; i<data.length; i++){
                let label = document.createElement("label");
                label.innerHTML += '<input class="uk-checkbox" id="'+data[i].id_category+'" type="checkbox" value = "'+data[i].name+'"> ' + data[i].name;
                categoryFilter.appendChild(label);
            }      
        });
    });

        
    //Получение уникального кода аптеки    
    let id_pharm = localStorage.getItem("id_pharmacies");
    
    //Выполняем запрос на остатки
    fetch(url + "stock?id="+id_pharm).then(function(response) {
        response.json().then(function(data) {
            for (var i=0; i<data.length; i++){
                var json = JSON.stringify(data[i]);
                let tr = document.createElement("tr");
                tr.innerHTML += "<td>"  + data[i].medName + ", " + data[i].name  + " " + data[i].dosage + "</td><td>"
                    +data[i].catName +"</td><td>"
                    +data[i].price+"</td><td>"
                    +data[i].count+"</td>";
                stockTableBody.appendChild(tr);
            }      
        });
    });
}



//При открытии модального окна ухода препаратов
function openModalCare(data){

    careName.innerHTML = data.medName;
    careForm.innerHTML = data.name;
    careParametr.innerHTML = data.dosage;
    console.log(data);
    id_stock = data.id_stock;
    countS = data.count;
    
    careCount.addEventListener('input', (event) => {
        let price = data.price * careCount.value;
        carePrice.innerHTML = price + " рублей";

        if (careCount.value > data.count) {
            careCount.setAttribute("class", "uk-input uk-form-danger")
        } else careCount.setAttribute("class", "uk-input uk-form-success")
    })
}

function loadTableData(){

    stockTableBody.innerHTML = "";

     //Получение уникального кода аптеки    
     let id_pharm = localStorage.getItem("id_pharmacies");

     //Выполняем запрос на остатки
     fetch(url + "stock?id="+id_pharm).then(function(response) {
        response.json().then(function(data) {
            for (var i=0; i<data.length; i++){
                var json = JSON.stringify(data[i]);
                let tr = document.createElement("tr");
                tr.innerHTML += "<td>"  + data[i].medName + ", " + data[i].name  + " " + data[i].dosage + "</td><td>"
                    +data[i].count +"</td><td>"
                    +data[i].price+"</td><td>"
                    +"<a uk-toggle='target: #modal-close-default' onclick='openModalCare("+json+")'>Уход</a></td>";
                stockTableBody.appendChild(tr);
            }      
        });
    });
}

function loadPharmName(){
    //Получение уникального кода аптеки    
    let id_pharm = localStorage.getItem("id_pharmacies");
    
    //Выполняем запрос на получении данных аптеки
    fetch(url + "pharmData?id="+id_pharm).then(function(response) {
        response.json().then(function(data) {
            pharmName.innerHTML = "Аптека «" + data[0].name + "»";
        });
    });
}

//Функция для загрузки данных аптеки
function loadDataPharm(){
    
    //Получение уникального кода аптеки    
    let id_pharm = localStorage.getItem("id_pharmacies");
    
    //Выполняем запрос на получении данных аптеки
    fetch(url + "pharmData?id="+id_pharm).then(function(response) {
        response.json().then(function(data) {
            PharmName.innerHTML = "Аптека «" + data[0].name + "»";
            PharmAdress.innerHTML = "Адрес: " + data[0].adress;
            PharmPhone.innerHTML = "Телефон: " + data[0].phone;
            PharmWindow.innerHTML = "Ссылка на терминал: <a href='terminal.html' target='_blank'>Открыть</a>" 
        });
    });

    loadTableData();
   

    //Выполняем запрос на заполнение выпадающего списка медикаментов
    fetch(url + "medecine").then(function(response) {
        response.json().then(function(data) {
            for (var i=0; i<data.length; i++){
                let option = document.createElement("option");
                option.setAttribute("value", data[i].id_medecine)
                option.innerHTML += data[i].name;
                medecineSelect.appendChild(option);
            }      
        });
    });

    //Выполняем запрос на заполнение выпадающего списка формы медикаментов
    fetch(url + "form").then(function(response) {
        response.json().then(function(data) {
            for (var i=0; i<data.length; i++){
                let option = document.createElement("option");
                option.setAttribute("value", data[i].id_form)
                option.innerHTML += data[i].name;
                formSelect.appendChild(option);
            }      
        });
    });

    //Когда форма выбрана
    formSelect.addEventListener('change', (event) => {
        //Очищаем список
        parametrSelect.innerHTML = "";
        //Выполняем запрос на заполнение выпадающего списка параметров медикаментов
        fetch(url + "parametr?id=" + formSelect.value).then(function(response) {
            response.json().then(function(data) {
                for (var i=0; i<data.length; i++){
                                
                    let option = document.createElement("option");
                    option.setAttribute("value", data[i].id_parametr)
                    option.innerHTML += data[i].dosage;
                    
                    parametrSelect.appendChild(option);
                }      
            });
        });
    })

}

//Получаем значения всех выбранных checkbox
function getCheckedCheckBoxes() {
    var checkboxes = document.getElementsByClassName('uk-checkbox');
    var checkboxesChecked = []; // можно в массиве их хранить, если нужно использовать 
    for (var index = 0; index < checkboxes.length; index++) {
        if (checkboxes[index].checked) {
            checkboxesChecked.push(checkboxes[index].value); // положим в массив выбранный
        }
    }
    return checkboxesChecked; // для использования в нужном месте
}

//Фильтрация данные в таблице
function search() {
    // Поиск элементов
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    tr = table.getElementsByTagName("tr");

    // Перебираем данные
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}


function filterCheckbox(){
    var data = getCheckedCheckBoxes();
    console.log(data);
    
}
