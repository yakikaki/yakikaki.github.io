document.addEventListener('DOMContentLoaded', function () {
	// ****************
	// GLOBAL VARIABLES
	// ****************
	const openModal = document.querySelectorAll('[data-open]');
	const closeModal = document.querySelectorAll('[data-close]');

	const isVisible = 'is-visible';

	const btnTask = document.querySelector('#add__task');
	const taskTitle = document.querySelector('#todo1');

	const containerAlert = document.querySelector('#alert__empty');

	const todoContainer = document.querySelector('.to-do');

	const containerDrop = document.querySelectorAll('.dropzone');
	let draggableTodo = null;

	let tasks = [];

	// *********
	// FUNCTIONS
	// *********
	const TodoTaskContainer = (task) => {
		const $div = document.createElement('div');
		const $p = document.createElement('p');
		const $button = document.createElement('button');

		$div.classList.add('container__todo');
		$div.classList.add('card');
		$div.setAttribute('id', task.getId());

		// ****** Drag and drop events *******
		$div.setAttribute('draggable', 'true');

		$div.addEventListener('dragstart', dragStart);
		$div.addEventListener('dragend', dragEnd);

		function dragStart() {
			draggableTodo = this;
		}

		function dragEnd() {
			draggableTodo = null;
		}

		containerDrop.forEach((status) => {
			status.addEventListener('dragover', dragOver);
			status.addEventListener('dragenter', dragEnter);
			status.addEventListener('dragleave', dragLeave);
			status.addEventListener('drop', dragDrop);
		});

		function dragOver(e) {
			e.preventDefault();
		}

		function dragEnter() {
			this.style.border = '5px solid #fff3b8';
		}

		function dragLeave() {
			this.style.border = 'none';
		}

		function dragDrop() {
			if (this.classList.contains('doing')) {
				draggableTodo.style.background = '#bdaa4a';
			} else if (this.classList.contains('done')) {
				draggableTodo.style.background = '#4abd54';
			} else {
				draggableTodo.style.background = '#457b9d';
			}

			this.style.border = 'none';
			this.appendChild(draggableTodo);
		}

		$p.innerHTML = `${task.getName()}`;

		$button.innerHTML = 'X';
		$button.classList.add('remove__button');

		// Remove task when press X button
		$button.addEventListener('click', (e) => {

			removeTodo($div.getAttribute('id'));

			removeFromArray(e);
		});

		$div.appendChild($p);
		$div.appendChild($button);

		return $div;
	};

	const removeTodo = (id) => {
		document.getElementById(id).remove();
	};

	const removeFromArray = (e) => {
		let index;
		for (let i = 0; i < tasks.length; i++) {
			if (tasks[i].name === e.target.parentElement.childNodes[0].innerHTML) {
				index = i;
			}
		}

		tasks.splice(index, 1);
	};


	for (let elem of openModal) {
		elem.addEventListener('click', function () {
			const modalId = this.dataset.open;
			document.getElementById(modalId).classList.add(isVisible);
		});
	}

	for (let elem of closeModal) {
		elem.addEventListener('click', function () {
			this.parentElement.parentElement.parentElement.classList.remove(isVisible);
		});
	}

	document.addEventListener('click', (e) => {
		if (e.target == document.querySelector('.modal.is-visible')) {
			document.querySelector('.modal.is-visible').classList.remove(isVisible);

			containerAlert.classList.remove('alert');
		}
	});

	document.addEventListener('keyup', (e) => {
		if (e.key === 'Escape' && document.querySelector('.modal.is-visible')) {
			document.querySelector('.modal.is-visible').classList.remove(isVisible);
			containerAlert.classList.remove('alert');
		}
	});

	btnTask.addEventListener('click', function (e) {
		e.preventDefault();

		if (taskTitle.value === '') {
			containerAlert.classList.add('alert');
			containerAlert.innerHTML = 'The input value cannot be empty';
			containerAlert.style.display = 'block';

			setTimeout(() => {
				containerAlert.style.display = 'none';
			}, 2000);
			return;
		} else {
			document.querySelector('.modal.is-visible').classList.remove(isVisible);

			// Prevent more than 7 tasks
			if (tasks.length < 7) {
				const task = new Task(taskTitle.value);

				tasks.push(task);

				todoContainer.appendChild(TodoTaskContainer(task));
			} else {
				containerAlert.classList.add('alert');
				containerAlert.innerHTML = 'You have reached the maximum amount of tasks, please delete some tasks.';
				containerAlert.style.display = 'block';
				return;
			}
		}
	});
});


class Task {
	static id = 1;

	constructor(name) {
		this.id = Task.id++;
		this.name = name;
	}

	setName(name) {
		this.name = name;
	}

	getName() {
		return this.name;
	}

	getId() {
		return Task.id;
	}
}
