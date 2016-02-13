$(document).ready(function(){

	function initMainPage() {
		$('#content').html('');
		$.each(reminders, function(index, reminders_for_a_day){
		    $.each(reminders_for_a_day, function(day, medicines_day_parts) {
				if (day == 'today') {
					day = 'Dnes';
				}
				$('#content').append('<div class="media">\
					<div class="media-body">\
					<h4 class="media-heading date">' + day + '</h4>\
					</div>\
				</div>');
				$('#content').append(getLineHtml(medicines_day_parts));
			})
		});
	}

	function getLineHtml(medicines_day_parts) {
		var line_html = '';
		$.each(medicines_day_parts, function(part_of_day, medicines_list){
			var is_first = true;
			$.each(medicines_list, function(index, medicine){
				line_html += '<div class="media">';
				if (is_first) {
					line_html += '<div class="media-left">\
					<a class="icon green" href="#">\
						<i class="fa ' + (part_of_day === 'night' ? 'fa-moon-o' : 'fa-sun-o') + ' fa-2x icon"></i>\
					</a>\
					</div>'
				}
				if (!is_first) {
					line_html += 
						'<div class="media-left">\
							<div class="line" href="#">\
								<!--<i class="fa fa-circle fa-sm"></i>-->\
							</div>\
						</div>'
				}
				line_html += '<div class="media-left time">' + medicine.time + '</div>';
				line_html += 
					'<div class="media-body">\
						<h4 class="media-heading">' + medicine.name + '</h4>\
						' + medicine.dose + (medicine.running_out ? (', <span class="text-danger"><b>Ostáva</b> ' + medicine.pills_remaining + '</span>') : '') +
					'</div>';
				line_html += 
						'<div class="media-right iconRight">\
							<span class="green glyphicon glyphicon-pencil icon edit-icon"></i>\
						</div>';
				if (medicine.running_out) {
					line_html += 
						'<div class="media-right">\
							<i class="fa fa-exclamation-triangle fa-2x icon iconRight text-danger"></i>\
						</div>';
				}			
				if (medicine.note || medicine.frequency_text || medicine.date_from) {
					line_html += 
						'<div class="info">' +
							(medicine.note ? ('<p><b>Poznámka: </b>' + medicine.note + '</p>') : '') +
							(medicine.frequency_text ? ('<p><b>Dávkovanie:</b> ' + medicine.frequency_text + '</p>') : '') +			
							(medicine.running_out ? '' : (medicine.pills_remaining ? ('<p><span class="bold">Ostáva:</span> ' + medicine.pills_remaining + ' tabliet</p>') : '')) + 
							(medicine.date_from ? ('<p><b>Od:</b> ' + medicine.date_from + ' <b>Do:</b> ' + medicine.date_to + '</p>') : '') +
						'</div>';
				}
				line_html += "</div>";
				is_first = false;
			})
		});
		return line_html;
	}

	$('body').on('click', '.media', function() {
		$(this).find('.edit-icon').toggle();
		$(this).find('.info').slideToggle();
	});

	$('.section-link').click(function(e) {
		e.preventDefault();
		var section_id = $(this).data('section-id');
		showSection(section_id);
	})

	function showSection(section_id) {
		$('.page-section').hide();
		$('#' + section_id).show();
	}

	$('.submit-pill-info').click(function() {
		var medicine_name = $('[name="medicine_name"]').val()
		var reminder_date = '' + $('[name="start_date"]').val();
		var frequency = $('[name="frequency"]').val();
		var pills_count = $('[name="pills_count"]').val();
		var doctor_name = $('[name="doctor_name"]').val();
		addRecord(medicine_name, reminder_date, pills_count, '12:00', '1 tbl.', frequency)

		initMainPage();
		showSection('main-page');
	});

	function addRecord(medicine_name, reminder_date, pills_count, time, dose, frequency_text){
		var medicine_record = {
			'name' : medicine_name,
			'pills_remaining' : pills_count + '/' + pills_count,
			'time' : time,
			'dose' : dose,
			'frequency_text' : frequency_text,
		};
		reminder_obj = {};
		reminder_obj[reminder_date] = {'day' : [medicine_record]} ;
		reminders.push(reminder_obj);
	}

	initMainPage();

	$('.receipt-img').click(function() {
		$(this).hide();
		$('.receipt-text').show();
	});

	$('.submit-pill-info-from-img').click(function(e){
		e.preventDefault();
		addRecord('FLIXOTIDE DISKUS 500', '20.2.2016', 20, '12:00', '2 tbl.', '2x denne');
		initMainPage();
		showSection('main-page');
	});

	$('.alert-trigger').click(function() {
		$('.pill-warning').modal('show');
	});

	$('.remove-acylpirin').click(function() {
		reminders[0]['today']['night'].splice(0,1);
		initMainPage();
		$('.pill-warning').modal('hide');
	});
});