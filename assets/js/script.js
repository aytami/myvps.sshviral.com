$(document).ready(function() {

	$(document).on('focus', '#duration', function(){
		$(this).bootstrapMaterialDatePicker({
			weekStart: 0, time: false
		});
	});

	$(document).on('beforeChange', '#duration', function () {
		$('#duration-form').addClass('focused');
	});

	$('#duration').bootstrapMaterialDatePicker({
		weekStart: 0, time: false
	});

	$('#duration').on('beforeChange', function () {
		$('#duration-form').addClass('focused');
	}); 
});

function generateGiftCode()
{
	$('#coupon').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		
		var data = $(this).serialize();
		$(':input', $(this)).not('#_token').val('');

		$.ajax({
			url: '/coupon',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-generate-coupon').prop('disabled', true);
				$('#btn-generate-coupon').text('GENERATING......');
			},
			success: function(data){
				$('#btn-generate-coupon').prop('disabled', false);
				$('#btn-generate-coupon').text('GENERATE');
				showNotification('success','Coupon generated successfully!');
			},
			error: function(data){
				window.setTimeout(function(){
					$('#btn-generate-coupon').prop('disabled', false);
					$('#btn-generate-coupon').text('GENERATE');
					showNotification('error', 'Something went wrong.');
				}, 2000);
			}
		});
	});
}

function deposit()
{
	$('#deposit').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		var data = $(this).serialize();

		$.ajax({
			url: '/deposit',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-quick-deposit').prop('disabled', true);
				$('#btn-quick-deposit').text('PLEASE WAIT......');
			},
			success: function(data){
				$('#btn-quick-deposit').prop('disabled', false);
				$('#btn-quick-deposit').text('DEPOSIT');
				console.log(data);
				showNotification('success', 'Reseller : ' + data.data.reseller + ' balance +' + data.data.balance_plus + ' successfully!');
			},
			error: function(data){
				window.setTimeout(function(){
					$('#btn-quick-deposit').prop('disabled', false);
					$('#btn-quick-deposit').text('DEPOSIT');
					console.log(data);
					showNotification('error','Something went wrong.');
				}, 2000);
			}
		});
	});
}


function addserver()
{
	$('#addserver').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		
		var data = $(this).serialize();

		$.ajax({
			url: '/addserver',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-add-server').prop('disabled', true);
				$('#btn-add-server').text('PLEASE WAIT......');
			},
			success: function(data){
				$('#btn-add-server').prop('disabled', false);
				$('#btn-add-server').text('ADD');
				showNotification('success', 'Server successfully added!');

				window.location = data.next;
			},
			error: function(data){
				window.setTimeout(function(){
					$('#btn-add-server').prop('disabled', false);
					$('#btn-add-server').text('ADD');
					showNotification('error', ' Something went wrong.');
				}, 2000);
			}
		});
	});
}

function repairDropbear(ip)
{
	$('#result').html('');
	var data = 'ip=' + ip + '&_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/service/dropbear/repair',
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#btn-repair-dropbear').attr('disabled', true);
			$('#btn-repair-dropbear').text('REPAIRING...');
		},
		success: function(data)
		{
			$('#btn-repair-dropbear').attr('disabled', true);
			$('#btn-repair-dropbear').text('REPAIR');
			$('#result').append('<div class="alert alert-success">Dropbear successfully repaired, Please refresh this pages to see the result.</div>');
			return $("html, body").animate({ scrollTop: 0 }, "slow");
		},
		error: function(data)
		{
			$('#btn-repair-dropbear').attr('disabled', false);
			$('#btn-repair-dropbear').text('REPAIR');
			if(data.status == 'No Server')
			{
				$('#result').append('<div class="alert alert-danger">Server with ip address ' + data.data.ip + ' not found.</div>');
				$("html, body").animate({ scrollTop: 0 }, "slow");
				return showNotification('error', 'Whoops! Failed to repair server.')
			}
			
			$('#result').append('<div class="alert alert-danger">Whoops, system failed to repair dropbear, Please repair by yourself with logging in to server.</div>');
			$("html, body").animate({ scrollTop: 0 }, "slow");			
			return showNotification('error', 'Whoops! There was a problem.')
		}
	});
}

function testDropbear(ip)
{
	$('#result').html('');
	var data = 'ip=' + ip + '&_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/service/dropbear/test',
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#btn-test-dropbear').attr('disabled', true);
			$('#btn-test-dropbear').text('TESTING...');
		},
		success: function(data)
		{
			$('#btn-test-dropbear').attr('disabled', false);
			$('#btn-test-dropbear').text('TEST');
			$('#result').append('<pre><code class="bash">DROPBEAR TEST RESULT FROM ' + data.data.host + ' & PORT ' + data.data.port + ': <br /> Status: Ok<br /> Host/Port: <code>' + data.data.host + '/' + data.data.port + '</code><br /> Client Identifier: ' + data.data.client_identifier + '<br /> Server Identifier: ' + data.data.server_identifier + '<br /> Kex Algorithm: <br /><ul id="kex_algorithm">' + $.each(data.data.kex_algorithm,function(item){item}) + '</ul> Server Host Algorithm: <br /><ul> ' + $.each(data.data.server_algorithm,function(item){item}) + ' </ul> Client Encryption Algorithm : <ul>' + $.each(data.data.client_encryption_algorithm, function(item){item}) + '</ul> Server Encryption Algorithm: <ul>' + $.each(data.data.server_encryption_algorithm, function(item){item}) + '</ul> Client Mac Algorithm: <ul>' + $.each(data.data.client_mac_algorithm,function(item){item}) + '</ul> Server Mac Algorithm: <ul>' + $.each(data.data.server_mac_algorithm, function(item){item}) + '</ul> Client Compresion Algorithm: <ul>' + $.each(data.data.client_compression_algorithm,function(item){item}) + '</ul> Server Compression Algorithm: <ul>' + $.each(data.data.server_compression_algorithm, function(item){item}) + '</ul></code></pre>');
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return showNotification('success', 'Dropbear Test: Running...');
			
		},
		error: function(data)
		{
			$('#btn-test-dropbear').attr('disabled', false);
			$('#btn-test-dropbear').text('TEST');
			if(data.status == 'No Server')
			{
				$('#result').append('<div class="alert alert-danger">Server with ip address ' + data.data.ip + ' not found.</div>');
				$("html, body").animate({ scrollTop: 0 }, "slow");
				return showNotification('error', 'Whoops! Failed to repair services.')
			}
			
			$('#result').append('<div class="alert alert-danger">Server refused to connect.</div>');
			$("html, body").animate({ scrollTop: 0 }, "slow");			
			return showNotification('error', 'Whoops! There was a problem.')
		}
	});
}

function repairSquid(ip)
{
	$('#result').html('');
	var data = 'ip=' + ip + '&_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/service/squid/repair',
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#btn-repair-squid').attr('disabled', true);
			$('#btn-repair-squid').text('REPAIRING...');
		},
		success: function(data)
		{
			$('#btn-repair-squid').attr('disabled', true);
			$('#btn-repair-squid').text('REPAIR');
			$('#result').append('<div class="alert alert-success">Squid successfully repaired, Please refresh this pages to see the result.</div>');
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return showNotification('success', 'Squid Successfully repaired!');
		},
		error: function(data)
		{
			$('#btn-repair-squid').attr('disabled', false);
			$('#btn-repair-squid').text('REPAIR');
			if(data.status == 'No Server')
			{
				$('#result').append('<div class="alert alert-danger">Server with ip address ' + data.data.ip + ' not found.</div>');
				$("html, body").animate({ scrollTop: 0 }, "slow");
				return showNotification('error', 'Whoops! Failed to repair server.');
			}
			
			$('#result').append('<div class="alert alert-danger">Whoops, system failed to repair squid, Please repair by yourself with logging in to server.</div>');
			$("html, body").animate({ scrollTop: 0 }, "slow");			
			return showNotification('error', 'Whoops! There was a problem.');
		}
	});
}

function testSquid(ip)
{
	$('#result').html('');
	var data = 'ip=' + ip + '&_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/service/squid/test',
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#btn-test-squid').attr('disabled', true);
			$('#btn-test-squid').text('TESTING...');
		},
		success: function(data)
		{
			$('#btn-test-squid').attr('disabled', false);
			$('#btn-test-squid').text('TEST');
			$('#result').append('<div class="alert alert-success">' + data.data.reason + '</div>');
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return showNotification('success', 'Squid Test: Running..')
		},
		error: function(data)
		{
			$('#btn-test-squid').attr('disabled', false);
			$('#btn-test-squid').text('TEST');
			
			$('#result').append('<div class="alert alert-danger">Whoops, system failed to repair squid, Please repair by yourself with logging in to server.</div>');
			$("html, body").animate({ scrollTop: 0 }, "slow");			
			return showNotification('error', 'Whoops! There was a problem.')
		}
	});
}

function repairOpenVPN(ip)
{
	$('#result').html('');
	var data = 'ip=' + ip + '&_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/service/openvpn/repair',
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#btn-repair-openvpn').attr('disabled', true);
			$('#btn-repair-openvpn').text('REPAIRING...');
		},
		success: function(data)
		{
			$('#btn-repair-openvpn').attr('disabled', true);
			$('#btn-repair-openvpn').text('REPAIR');
			$('#result').append('<div class="alert alert-success">OpenVPN successfully repaired, Please refresh this pages to see the result.</div>');
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return showNotification('success', 'OpenVPN Successfully Repaired!');
		},
		error: function(data)
		{
			$('#btn-repair-openvpn').attr('disabled', false);
			$('#btn-repair-openvpn').text('REPAIR');
			if(data.status == 'No Server')
			{
				$('#result').append('<div class="alert alert-danger">Server with ip address ' + data.data.ip + ' not found.</div>');
				$("html, body").animate({ scrollTop: 0 }, "slow");
				return showNotification('error', 'Whoops! Failed to repair services.')
			}
			
			$('#result').append('<div class="alert alert-danger">Whoops, system failed to repair openvpn, Please repair by yourself with logging in to server.</div>');
			$("html, body").animate({ scrollTop: 0 }, "slow");			
			return showNotification('error', 'Whoops! There was a problem.')
		}
	});
}

function testOpenVPN(ip)
{
	$('#result').html('');
	var data = 'ip=' + ip + '&_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/service/openvpn/test',
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#btn-test-openvpn').attr('disabled', true);
			$('#btn-test-openvpn').text('TESTING...');
		},
		success: function(data)
		{
			$('#btn-test-openvpn').attr('disabled', false);
			$('#btn-test-openvpn').text('TEST');
			$('#result').append('<div class="alert alert-success">' + data.data.reason + '</div>');
			$("html, body").animate({ scrollTop: 0 }, "slow");
			return showNotification('success', 'OpenVPN Test: Runing...');
		},
		error: function(data)
		{
			$('#btn-test-openvpn').attr('disabled', false);
			$('#btn-test-openvpn').text('TEST');
			
			$('#result').append('<div class="alert alert-danger">Whoops, system failed to test openvpn, Please repair by yourself with logging in to server.</div>');
			$("html, body").animate({ scrollTop: 0 }, "slow");			
			return showNotification('error', 'There was a problem while testing services.');
		}
	});
}

function testBadVPN(ip)
{
	$('#result').html('');
	var data = 'ip=' + ip + '&_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/service/badvpn/test',
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#btn-test-badvpn').attr('disabled', true);
			$('#btn-test-badvpn').text('TESTING...');
		},
		success: function(data)
		{
			$('#btn-test-badvpn').attr('disabled', false);
			$('#btn-test-badvpn').text('TEST');
			$('#result').append('<div class="alert alert-success">' + data.data.reason + '</div>');
			return $("html, body").animate({ scrollTop: 0 }, "slow");
		},
		error: function(data)
		{
			$('#btn-test-badvpn').attr('disabled', false);
			$('#btn-test-badvpn').text('TEST');
			
			$('#result').append('<div class="alert alert-danger">Whoops, system failed to repair badvpn, Please repair by yourself with logging in to server.</div>');
			return $("html, body").animate({ scrollTop: 0 }, "slow");			
		}
	});
}

function createSSH()
{
	$('#create-ssh').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();

		$.ajax({
			url: '/ssh/create',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-create-ssh').attr('disabled', true);
				$('#btn-create-ssh').text('CREATING...');
			},
			success: function(d)
			{
				$('#btn-create-ssh').attr('disabled', false);
				$('#btn-create-ssh').text('CREATE');

				// handle for premium account
				if(d.status != 'Trial Success')
				{
					// change value of balance
					$('span.badge.bg-pink').html('');
					$('span.badge.bg-pink').append(d.curent_user_balance);

					// change value of points
					$('span.badge.bg-purple').html('');
					$('span.badge.bg-purple').append(d.curent_user_point);

					// change value of ssh users
					$('span#ssh-user').html('');
					$('span#ssh-user').append(d.curent_ssh_user);


					// display result
					var result = $('<div class="alert alert-success"><h4>SSH Account successfully created!</h4><br /> Username: <code>' + d.details.username + '</code> <br /> Password: ' + d.details.password + ' <br /> Host/IP: ' + d.details.host + ' <br />' + d.message + '</div>').hide().fadeIn('slow');
					$('div#result').append(result);
					
					$("html, body").animate({ scrollTop: 0 }, "slow");			
					return showNotification('success', 'SSH Account Successfully created!');
				}

				// trial handling.
				// change value of user created
				$('span#account-created').html('');
				$('span#account-created').append(d.trial_account);

				// change percent value
				$('span#percent').html('');
				$('span#percent').append(d.percent);
				$('div#trial-quota').attr('style', 'width: ' + d.percent + '%');

				var result = $('<div class="alert alert-success"><h4>Trial SSH Account successfully created!</h4><br /> Username: <code>' + d.details.username + '</code> <br /> Password: ' + d.details.password + ' <br /> Host/IP: ' + d.details.host + ' <br />' + d.message + '</div>').hide().fadeIn('slow');
				$('div#result').append(result);
				$("html, body").animate({ scrollTop: 0 }, "slow");			
				return showNotification('success', 'Trial Account Successfully Created!');
			},
			error: function(d)
			{
				$('#btn-create-ssh').attr('disabled', false);
				$('#btn-create-ssh').text('CREATE');

				var error = d.responseJSON;

				if(error.status == 'Trial Limit')
				{
					var result = $('<div class="alert alert-danger">Whoops! Your Trial Quota Reach Daily Limit.</div>').hide().fadeIn('slow');
					$('div#result').append(result);
					$("html, body").animate({ scrollTop: 0 }, "slow");			
					return showNotification('error', 'Trial Quota Exceeded!');
				}
					
				if(error.response == 'Validation Error')
				{
				   var items = [];
				   $.each(error.data.error, function(i, item) {
				          items.push('<li>' + item + '</li>');
				   });  // close each()
				   $('div#result').append($('<div class="alert alert-danger"><h4>Please fix following error! </h4><ul>' + items.join('') + '</ul></div>').hide().fadeIn('slow'));
				   $("html, body").animate({ scrollTop: 0 }, "slow");			
				   return showNotification('error', 'Whoops! Something went wrong!');
				}

				if(error.status == 'Error Point')
				{
					var result = $('<div class="alert alert-warning">' + error.data.reason + '</div>').hide().fadeIn('slow');
					$('div#result').append(result);
					$("html, body").animate({ scrollTop: 0 }, "slow");			
				    return showNotification('error', 'Whoops! Something went wrong!');
				}

				if(error.status == 'Error Balance')
				{
					var result = $('<div class="alert alert-warning">' + error.data.reason + '</div>').hide().fadeIn('slow');
					$('div#result').append(result);
					$("html, body").animate({ scrollTop: 0 }, "slow");			
				    return showNotification('error', 'Whoops! Something went wrong!');
				}

				if(error.status == 'Error')
				{
					var result = $('<div class="alert alert-warning">' + error.data.reason + '</div>').hide().fadeIn('slow');
					$('div#result').append(result);
					$("html, body").animate({ scrollTop: 0 }, "slow");			
				    return showNotification('error', 'Whoops! Server Daily Limit Reached!');
				}

				return console.log(error);
			}
		})
	});
}

function createVPN()
{
	$('#create-vpn').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();

		$.ajax({
			url: '/vpn/create',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-create-vpn').attr('disabled', true);
				$('#btn-create-vpn').text('CREATING...');
			},
			success: function(d)
			{
				$('#btn-create-vpn').attr('disabled', false);
				$('#btn-create-vpn').text('CREATE');

				// handle for premium account
				if(d.status != 'Trial Success')
				{
					// change value of balance
					$('span.badge.bg-pink').html('');
					$('span.badge.bg-pink').append(d.curent_user_balance);

					// change value of points
					$('span.badge.bg-purple').html('');
					$('span.badge.bg-purple').append(d.curent_user_point);

					// change value of ssh users
					$('span#vpn-user').html('');
					$('span#vpn-user').append(d.curent_vpn_user);


					// display result
					var result = $('<div class="alert alert-success"><h4>VPN Account successfully created!</h4><br /> Username: <code>' + d.details.username + '</code> <br /> Password: ' + d.details.password + ' <br /> Host/IP: ' + d.details.host + ' <br />' + d.message + '</div>').hide().fadeIn('slow');
					$('div#result').append(result);
					
					$("html, body").animate({ scrollTop: 0 }, "slow");			
					return showNotification('success', 'SVPN Account Successfully created!');
				}

				// trial handling.
				// change value of user created
				$('span#account-created').html('');
				$('span#account-created').append(d.trial_account);

				// change percent value
				$('span#percent').html('');
				$('span#percent').append(d.percent);
				$('div#trial-quota').attr('style', 'width: ' + d.percent + '%');

				var result = $('<div class="alert alert-success"><h4>Trial VPN Account successfully created!</h4><br /> Username: <code>' + d.details.username + '</code> <br /> Password: ' + d.details.password + ' <br /> Host/IP: ' + d.details.host + ' <br />' + d.message + '</div>').hide().fadeIn('slow');
				$('div#result').append(result);
				$("html, body").animate({ scrollTop: 0 }, "slow");			
				return showNotification('success', 'Trial Account Successfully Created!');
			},
			error: function(d)
			{
				$('#btn-create-vpn').attr('disabled', false);
				$('#btn-create-vpn').text('CREATE');

				var error = d.responseJSON;

				if(error.status == 'Trial Limit')
				{
					var result = $('<div class="alert alert-danger">Whoops! Your Trial Quota Reach Daily Limit.</div>').hide().fadeIn('slow');
					$('div#result').append(result);
					$("html, body").animate({ scrollTop: 0 }, "slow");			
					return showNotification('error', 'Trial Quota Exceeded!');
				}
					
				if(error.response == 'Validation Error')
				{
				   var items = [];
				   $.each(error.data.error, function(i, item) {
				          items.push('<li>' + item + '</li>');
				   });  // close each()
				   $('div#result').append($('<div class="alert alert-danger"><h4>Please fix following error! </h4><ul>' + items.join('') + '</ul></div>').hide().fadeIn('slow'));
				   $("html, body").animate({ scrollTop: 0 }, "slow");			
				   return showNotification('error', 'Whoops! Something went wrong!');
				}

				if(error.status == 'Error Point')
				{
					var result = $('<div class="alert alert-warning">' + error.data.reason + '</div>').hide().fadeIn('slow');
					$('div#result').append(result);
					$("html, body").animate({ scrollTop: 0 }, "slow");			
				    return showNotification('error', 'Whoops! Something went wrong!');
				}

				if(error.status == 'Error Balance')
				{
					var result = $('<div class="alert alert-warning">' + error.data.reason + '</div>').hide().fadeIn('slow');
					$('div#result').append(result);
					$("html, body").animate({ scrollTop: 0 }, "slow");			
				    return showNotification('error', 'Whoops! Something went wrong!');
				}

				if(error.status == 'Error')
				{
					var result = $('<div class="alert alert-warning">' + error.data.reason + '</div>').hide().fadeIn('slow');
					$('div#result').append(result);
					$("html, body").animate({ scrollTop: 0 }, "slow");			
				    return showNotification('error', 'Whoops! Server Daily Limit Reached!');
				}

				return console.log(error);
			}
		})
	});
}

function removeCert(id) {
	swal({
		title: "Are you sure?",
		text: "The Certificate will be removed permanently.",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes, delete it!",
		cancelButtonText: "No, cancel it!",
		closeOnConfirm: false,
		closeOnCancel: false,
		showLoaderOnConfirm: true,
	},
		function (isConfirm) {
			if (isConfirm) {
				window.setTimeout(function () {
					var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

					$.ajax({
						url: '/vpn/cert/delete/' + id,
						type: 'POST',
						data: data,
						success: function (d) {
							$('table tr#row-' + id).remove();
							return swal("Deleted!", "Ceritificate Successfully Deleted!", "success");
						},
						error: function (d) {
							swal("Failed!", "Something went wrong!", "error");
						}
					});
				}, 2000);
			} else {
				swal("Cancelled", "Your Certificate is safe.", "error");
			}
		});
}

function removeSSHAccount(id)
{
	swal({
	  title: "Are you sure?",
	  text: "The SSH Account will be removed permanently.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, delete it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/ssh/delete/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
					$('table tr#row-' + id).remove();
		    		return swal("Deleted!", "SSH Account Successfully Deleted!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Your SSH Account is safe.", "error");
	  }
	});
}

function disableFeature(id) {
	swal({
		title: "Are you sure?",
		text: "This Feature will be disabled, and all service using this feature will no longer usable..",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes, disable it!",
		cancelButtonText: "No, cancel it!",
		closeOnConfirm: false,
		closeOnCancel: false,
		showLoaderOnConfirm: true,
	},
		function (isConfirm) {
			if (isConfirm) {
				window.setTimeout(function () {
					var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

					$.ajax({
						url: '/admin/features/disable/' + id,
						type: 'POST',
						data: data,
						success: function (d) {
							$('table tr#row-' + id + ' button#lock-account').removeClass("btn-warning");
							$('table tr#row-' + id + ' button#lock-account').addClass("btn-success");
							$('table tr#row-' + id + ' button#lock-account').attr('title', 'Enable Feature').tooltip('fixTitle');
							$('table tr#row-' + id + ' button#lock-account').attr('onclick', 'enableFeature(' + id + ')');
							$('table tr#row-' + id + ' i#lock-account').html('');
							$('table tr#row-' + id + ' i#lock-account').append('check');
							$('table tr#row-' + id + ' i#lock-account').attr('id', 'unlock-account')
							$('table tr#row-' + id + ' button#lock-account').attr('id', 'unlock-account')
							return swal("Done!", "Feature has been disabled!", "success");
						},
						error: function (d) {
							swal("Failed!", "Something went wrong!", "error");
						}
					});
				}, 2000);
			} else {
				swal("Cancelled", "Feature is safe!", "error");
			}
		});
}

function enableFeature(id) {
	swal({
		title: "Are you sure?",
		text: "This feature will be enabled, and all service using this feature will be usable again..",
		type: "warning",
		showCancelButton: true,
		confirmButtonColor: "#DD6B55",
		confirmButtonText: "Yes, enable it!",
		cancelButtonText: "No, cancel it!",
		closeOnConfirm: false,
		closeOnCancel: false,
		showLoaderOnConfirm: true,
	},
		function (isConfirm) {
			if (isConfirm) {
				window.setTimeout(function () {
					var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

					$.ajax({
						url: '/admin/features/enable/' + id,
						type: 'POST',
						data: data,
						success: function (d) {
							$('table tr#row-' + id + ' button#unlock-account').removeClass("btn-success");
							$('table tr#row-' + id + ' button#unlock-account').addClass("btn-warning");
							$('table tr#row-' + id + ' button#unlock-account').attr('title', 'Disable Feature').tooltip('fixTitle');
							$('table tr#row-' + id + ' button#unlock-account').attr('onclick', 'disableFeature(' + id + ')');
							$('table tr#row-' + id + ' i#unlock-account').html('');
							$('table tr#row-' + id + ' i#unlock-account').append('block');
							$('table tr#row-' + id + ' i#unlock-account').attr('id', 'lock-account');
							$('table tr#row-' + id + ' button#unlock-account').attr('id', 'lock-account');
							return swal("Done!", "Feature has been enabled!", "success");
						},
						error: function (d) {
							swal("Failed!", "Something went wrong!", "error");
						}
					});
				}, 2000);
			} else {
				swal("Cancelled", "Feature is safe!", "error");
			}
		});
}

function lockSSHAccount(id)
{
	swal({
	  title: "Are you sure?",
	  text: "The SSH Account will be Locked.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, lock it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/ssh/lock/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
					$('table tr#row-' + id + ' button#lock-account').removeClass("btn-warning");
					$('table tr#row-' + id + ' button#lock-account').addClass("btn-success");
					$('table tr#row-' + id + ' button#lock-account').attr('title', 'Unlock Account').tooltip('fixTitle');
					$('table tr#row-' + id + ' button#lock-account').attr('onclick', '`unlockSS`HAccount(' + id + ')');
					$('table tr#row-' + id + ' i#lock-account').html('');
					$('table tr#row-' + id + ' i#lock-account').append('lock_open');
					$('table tr#row-' + id + ' i#lock-account').attr('id', 'unlock-account')
					$('table tr#row-' + id + ' button#lock-account').attr('id', 'unlock-account')
		    		return swal("Locked!", "SSH Account Successfully Locked!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Your SSH Account is safe.", "error");
	  }
	});
}

function unlockSSHAccount(id)
{
	swal({
	  title: "Are you sure?",
	  text: "The SSH Account will be Unlocked.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, Unlock it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/ssh/unlock/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
					$('table tr#row-' + id + ' button#unlock-account').removeClass("btn-success");
					$('table tr#row-' + id + ' button#unlock-account').addClass("btn-warning");
					$('table tr#row-' + id + ' button#unlock-account').attr('title', 'Lock Account').tooltip('fixTitle');
					$('table tr#row-' + id + ' button#unlock-account').attr('onclick', 'lockSSHAccount(' + id + ')');
					$('table tr#row-' + id + ' i#unlock-account').html('');
					$('table tr#row-' + id + ' i#unlock-account').append('lock');
					$('table tr#row-' + id + ' i#unlock-account').attr('id', 'lock-account');
					$('table tr#row-' + id + ' button#unlock-account').attr('id', 'lock-account');
		    		return swal("Unlocked!", "SSH Account Successfully Unlocked!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Your SSH Account still Locked.", "error");
	  }
	});
}

function changeSSHPassword(id)
{
	swal({
	  title: "New Password!",
	  type: "input",
	  inputType: "password",
	  showCancelButton: true,
	  closeOnConfirm: false,
	  inputPlaceholder: "New Password",
	  showLoaderOnConfirm: true,
	},
	function(inputValue){
	  if (inputValue === false) return false;

	  if (inputValue === "") {
	    swal.showInputError("You need to write something!");
	    return false
	  }

	  window.setTimeout(function(){
	  	var data = 'password=' + inputValue + '&_token=' + $('meta[name="csrf-token"]').attr('content');
	  	$.ajax({
	  		url: '/ssh/password/' + id,
	  		type: 'POST',
	  		data: data,
	  		success: function(d){
	  			return swal("Nice!", "Password successfully changed!", "success");
	  		},
	  		error: function(d){
	  			return swal("Whoops!", "Something went wrong", "error");
	  		}
	  	});
	  },2000);
  });
}

function removeVPNAccount(id)
{
	swal({
	  title: "Are you sure?",
	  text: "The VPN Account will be removed permanently.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, delete it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/vpn/delete/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
					$('table tr#row-' + id).remove();
		    		return swal("Deleted!", "VPN Account Successfully Deleted!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Your VPN Account is safe.", "error");
	  }
	});
}

function lockVPNAccount(id)
{
	swal({
	  title: "Are you sure?",
	  text: "The VPN Account will be Locked.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, lock it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/vpn/lock/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
					$('table tr#row-' + id + ' button#lock-account').removeClass("btn-warning");
					$('table tr#row-' + id + ' button#lock-account').addClass("btn-success");
					$('table tr#row-' + id + ' button#lock-account').attr('title', 'Unlock Account').tooltip('fixTitle');
					$('table tr#row-' + id + ' button#lock-account').attr('onclick', 'unlockVPNAccount(' + id + ')');
					$('table tr#row-' + id + ' i#lock-account').html('');
					$('table tr#row-' + id + ' i#lock-account').append('lock_open');
					$('table tr#row-' + id + ' i#lock-account').attr('id', 'unlock-account')
					$('table tr#row-' + id + ' button#lock-account').attr('id', 'unlock-account')
		    		return swal("Locked!", "VPN Account Successfully Locked!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Your VPN Account is safe.", "error");
	  }
	});
}

function unlockVPNAccount(id)
{
	swal({
	  title: "Are you sure?",
	  text: "The VPN Account will be Unlocked.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, Unlock it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/vpn/unlock/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
					$('table tr#row-' + id + ' button#unlock-account').removeClass("btn-success");
					$('table tr#row-' + id + ' button#unlock-account').addClass("btn-warning");
					$('table tr#row-' + id + ' button#unlock-account').attr('title', 'Lock Account').tooltip('fixTitle');
					$('table tr#row-' + id + ' button#unlock-account').attr('onclick', 'lockVPNAccount(' + id + ')');
					$('table tr#row-' + id + ' i#unlock-account').html('');
					$('table tr#row-' + id + ' i#unlock-account').append('lock');
					$('table tr#row-' + id + ' i#unlock-account').attr('id', 'lock-account');
					$('table tr#row-' + id + ' button#unlock-account').attr('id', 'lock-account');
		    		return swal("Unlocked!", "VPN Account Successfully Unlocked!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Your VPN Account still Locked.", "error");
	  }
	});
}

function changeVPNPassword(id)
{
	swal({
	  title: "New Password!",
	  type: "input",
	  inputType: "password",
	  showCancelButton: true,
	  closeOnConfirm: false,
	  inputPlaceholder: "New Password",
	  showLoaderOnConfirm: true,
	},
	function(inputValue){
	  if (inputValue === false) return false;

	  if (inputValue === "") {
	    swal.showInputError("You need to write something!");
	    return false
	  }

	  window.setTimeout(function(){
	  	var data = 'password=' + inputValue + '&_token=' + $('meta[name="csrf-token"]').attr('content');
	  	$.ajax({
	  		url: '/vpn/password/' + id,
	  		type: 'POST',
	  		data: data,
	  		success: function(d){
	  			return swal("Nice!", "Password successfully changed!", "success");
	  		},
	  		error: function(d){
	  			return swal("Whoops!", "Something went wrong", "error");
	  		}
	  	});
	  },2000);
  });
}

function addDomain(id)
{
	var data = 'id=' + id + '&_token=' + $('meta[name="csrf-token"]').attr('content');
	swal({
	  title: "Are you sure?",
	  text: "This domain will be added to a DNS List!",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, add it!",
	  cancelButtonText: "No, cancel plx!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
	  	window.setTimeout(function(){
	  		$.ajax({
	  			url: '/dns/add',
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
		    		swal("Added!", "Domain successfully added!", "success");
		  			return console.log(d);
		  		},
		  		error: function(d)
		  		{
		   			 swal("Cancelled", "Domain Canceled", "error");
		  		}
	  		});
	  	},2000);
	  } else {
	      swal("Cancelled", "Domain Canceled", "error");
	  }
	});
}

function createDNS()
{
	$('#create-dns').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();
		$.ajax({
			url: '/dns/create',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-create-dns').attr('disabled', true);
				$('#btn-create-dns').text('CREATING...');
			},
			success: function(d)
			{
				$('#btn-create-dns').attr('disabled', false);
				$('#btn-create-dns').text('CREATE');
				return showNotification('success', 'DNS Record successfully created!');
			},
			error: function(d)
			{
				$('#btn-create-dns').attr('disabled', false);
				$('#btn-create-dns').text('CREATE');
				return showNotification('error', 'Whoops! Something went wrong!');
			}
		});
	});
}

function deleteRecord(id)
{
	var data = 'id=' + id + '&_token=' + $('meta[name="csrf-token"]').attr('content');
	swal({
	  title: "Are you sure?",
	  text: "This drecord will be deleted permanently.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, delete it!",
	  cancelButtonText: "No, cancel plx!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
	  	window.setTimeout(function(){
	  		$.ajax({
	  			url: '/dns/delete',
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
		    		swal("Added!", "Records successfully deleted!", "success");
					$('table tr#row-' + id).remove();
		  			return console.log(d);
		  		},
		  		error: function(d)
		  		{
	      			return swal("Whoops!", "Something went wrong.", "error");
		  		}
	  		});
	  	},2000);
	  } else {
		  return swal("Cancelled", " Your records is safe!", "error");
	  }
	});
}

function addDomainManual()
{
	$('#add-domain').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();
		$.ajax({
			url: '/dns/addmanual',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-add-domain').attr('disabled', true);
				$('#btn-add-domain').text('Saving...');
			},
			success: function(d)
			{
				$('#btn-add-domain').attr('disabled', false);
				$('#btn-add-domain').text('Save!');
				return showNotification('success', 'Domain successfully added!');
			},
			error: function(d)
			{
				$('#btn-add-domain').attr('disabled', false);
				$('#btn-add-domain').text('Save!');
				return showNotification('error', 'Whoops! something went wrong!');
			}
		});
	});
}

function removeDomain(id)
{
	swal({
	  title: "Are you sure?",
	  text: "This domain will be removed permanently from Cloudflare account.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, delete it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = 'id=' + id + '&_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/dns/remove/',
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
					$('table tr#row-' + id).remove();
		    		return swal("Deleted!", "Domain Successfully Deleted!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Your Domain Account is safe.", "error");
	  }
	});
}

function generateCoupon()
{
	$.ajax({
		url: '/coupon/generate-number',
		type: 'GET',
		success: function(d)
		{
			return $('#coupon-code').val(d.coupon);
		},
		error: function(d)
		{
			return swal('Whoops!', 'Something went wrong.', 'error');
		}
	});
}

function generateCouponCode()
{
	$('#generate-coupon').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();
		$.ajax({
			url: '/coupon/generate',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-generate-coupon').attr('disabled', true);
				$('#btn-generate-coupon').text('GENERATING...');
			},
			success: function(d){
				$('#btn-generate-coupon').attr('disabled', false);
				$('#btn-generate-coupon').text('GENERATE');

				swal({
					text: 'Coupon generated successfully!',
					type: 'success',
					title: 'Success!'
				},function(isConfirm){
					window.location.href = '/coupon/create';
					return $('#unused')[0].trigger('click');
				});
			}
		});
	});
}

function removeCoupon(id)
{
	swal({
	  title: "Are you sure?",
	  text: "This coupon will be removed permanently.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, delete it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = 'id=' + id + '&_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/coupon/remove/',
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
					$('table tr#row-' + id).remove();
					var badge = $('span#badge-unreedemed.badge').text();
		    		$('span#badge-unreedemed.badge').text(badge - 1);
		    		return swal("Deleted!", "Coupon Successfully Deleted!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Your Coupon is safe.", "error");
	  }
	});
}

function addReseller()
{
	$('#add-reseller').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();
		$.ajax({
			url: '/reseller/create',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-add-reseller').attr('disabled', true);
				$('#btn-add-reseller').text('CREATING..');
			},
			success: function(d)
			{
				$('#btn-add-reseller').attr('disabled', false);
				$('#btn-add-reseller').text('CREATE');

				return showNotification('success', 'Reseller successfully created!');
			},
			error: function(d)
			{
				$('#btn-add-reseller').attr('disabled', false);
				$('#btn-add-reseller').text('CREATE');

				return showNotification('error', 'Whoops! Something went wrong!');
			}
		});
	});
}

function addBalance(id)
{
	swal({
	  title: "Enter Balance!",
	  type: "input",
	  showCancelButton: true,
	  closeOnConfirm: false,
	  inputPlaceholder: "Balance",
	  showLoaderOnConfirm: true,
	},
	function(inputValue){
	  if (inputValue === false) return false;

	  if (inputValue === "") {
	    swal.showInputError("You need to write something!");
	    return false
	  }

	  window.setTimeout(function(){
	  	var data = 'balance=' + inputValue + '&_token=' + $('meta[name="csrf-token"]').attr('content');
	  	$.ajax({
	  		url: '/reseller/balance/' + id,
	  		type: 'POST',
	  		data: data,
	  		success: function(d){
	  			return swal("Nice!", "Balance Successfully Added!", "success");
	  		},
	  		error: function(d){
	  			return swal("Whoops!", "Something went wrong", "error");
	  		}
	  	});
	  },2000);
  });
}

function deleteReseller(id)
{
	swal({
	  title: "Are you sure?",
	  text: "This reseller will be removed permanently.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, delete it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/reseller/delete/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
					$('table tr#row-' + id).remove();
		    		return swal("Deleted!", "Reseller Successfully Deleted!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Reseller account is safe.", "error");
	  }
	});
}

function changeDetails()
{
	$('#change-details').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();
		$.ajax({
			url: '/profile/change-details',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('btn-change-details').attr('disabled', true);
				$('btn-change-details').text('SAVING...');
			},
			success: function(d){
				$('btn-change-details').attr('disabled', true);
				$('btn-change-details').text('SAVE');

				$('#username').val(d.details.username);
				$('#email').val(d.details.email);

				return showNotification('success', 'Details Saved!');
			},
			error: function(d){
				$('btn-change-details').attr('disabled', true);
				$('btn-change-details').text('SAVE');

				return showNotification('error', 'Whoops! SOmething went wrong!');
			}
		});
	});
}

function deleteServer(id)
{
	swal({
	  title: "Are you sure?",
	  text: "This Server will be removed permanently.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, delete it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/server/delete/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
					$('table tr#row-' + id).remove();
		    		return swal("Deleted!", "Server Successfully Deleted!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Your Server is safe.", "error");
	  }
	});
}

function settingServer(id)
{
	$('#serverSettingModal').modal('show');
	
	var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/server/setting/' + id,
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#server-setting-modal').html('');
			$('#server-setting-modal').append('<div id="please-wait" class="text-center">PLEASE WAIT...</div>');
		},
		success: function(response){
			window.setTimeout(function(){
				$('#server-setting-modal').append($(response).hide().fadeIn('slow'));
			},3000);
			$('#please-wait').fadeOut(3000);
		},
		error: function(response){
			window.setTimeout(function(){
				$('#server-setting-modal').append('<div class="alert alert-danger">Whoops! Something went wrong.</div>');
			},1000);
			$('#please-wait').hide(1000);
		}
	});
}

function editServerOnModal()
{
	$('#addserver').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();
		
		var data = $(this).serialize();

		$.ajax({
			url: '/server/edit/',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-add-server').prop('disabled', true);
				$('#btn-add-server').text('SAVING...');
			},
			success: function(data){
				$('#btn-add-server').prop('disabled', false);
				$('#btn-add-server').text('SAVE');
				showNotification('success', 'Server successfully edited!');
				return $('#serverSettingModal').modal('hide');
			},
			error: function(data){
				window.setTimeout(function(){
					$('#btn-add-server').prop('disabled', false);
					$('#btn-add-server').text('SAVE');
					showNotification('error', ' Something went wrong.');
				}, 2000);
			}
		});
	});
}

function editReseller(id){
	$('#editResellerModal').modal('show');
	
	var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/reseller/edit/' + id,
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#reseller-edit-body').html('');
			$('#reseller-edit-body').append('<div id="please-wait" class="text-center">PLEASE WAIT...</div>');
		},
		success: function(response){
			window.setTimeout(function(){
				$('#reseller-edit-body').append($(response).hide().fadeIn('slow'));
			},3000);
			$('#please-wait').fadeOut(3000);
		},
		error: function(response){
			window.setTimeout(function(){
				$('#reseller-edit-body').append('<div class="alert alert-danger">Whoops! Something went wrong.</div>');
			},1000);
			$('#please-wait').hide(1000);
		}
	});
}

function editResellerOnModal()
{
	$('#add-reseller').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();
		$.ajax({
			url: '/reseller/edit',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-add-reseller').attr('disabled', true);
				$('#btn-add-reseller').text('SAVING..');
			},
			success: function(d)
			{
				$('#btn-add-reseller').attr('disabled', false);
				$('#btn-add-reseller').text('SAVE');

				showNotification('success', 'Reseller successfully edited!');
				return $('#editResellerModal').modal('hide');
			},
			error: function(d)
			{
				$('#btn-add-reseller').attr('disabled', false);
				$('#btn-add-reseller').text('SAVE');

				showNotification('error', 'Whoops! Something went wrong!');
			}
		});
	});
}

function lockUserOnModal(id)
{
	swal({
	  title: "Are you sure?",
	  text: "This Reseller will not be able to login again",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, lock it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/reseller/lock/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
		  			$('#lock-reseller').text('UNLOCK');
		  			$('#lock-reseller').attr('onclick', 'unlockUserOnModal(' + id + ')');
		  			$('#lock-reseller').attr('id', 'unlock-reseller');
		    		return swal("Locked!", "Reseller Successfully Locked!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Reseller Account is safe.", "error");
	  }
	});
}

function unlockUserOnModal(id)
{
	swal({
	  title: "Are you sure?",
	  text: "This Reseller will be able to login again.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, unlock it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/reseller/unlock/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
		  			$('#unlock-reseller').text('LOCK');
		  			$('#unlock-reseller').attr('onclick', 'lockUserOnModal(' + id + ')');
		  			$('#unlock-reseller').attr('id', 'lock-reseller');
		    		return swal("Unlocked!", "Reseller Successfully Unlocked!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Reseller Account Still Locked.", "error");
	  }
	});
}

function suspendUserOnModal(id)
{
	swal({
	  title: "Are you sure?",
	  text: "This Reseller will be suspended.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, suspend it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/reseller/suspend/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
		  			$('#suspend-reseller').text('UNSUSPEND');
		  			$('#suspend-reseller').attr('onclick', 'unsuspendUserOnModal(' + id + ')');
		  			$('#suspend-reseller').attr('id', 'unsuspend-reseller');
		    		return swal("Suspend!", "Reseller Successfully Suspended!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Reseller Account Safe.", "error");
	  }
	});
}

function unsuspendUserOnModal(id)
{
	swal({
	  title: "Are you sure?",
	  text: "This Reseller will be Unsuspended and be able to login again.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, unsuspend it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/reseller/unsuspend/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
		  			$('#unsuspend-reseller').text('SUSPEND');
		  			$('#unsuspend-reseller').attr('onclick', 'suspendUserOnModal(' + id + ')');
		  			$('#unuspend-reseller').attr('id', 'suspend-reseller');
		    		return swal("Suspend!", "Reseller Successfully Suspended!", "success");
		  		},
		  		error: function(d)
		  		{
		    		swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Reseller Account Still Suspended.", "error");
	  }
	});
}

function deleteInfo(id)
{
	swal({
	  title: "Are you sure?",
	  text: "This info will be deleted permanently.",
	  type: "warning",
	  showCancelButton: true,
	  confirmButtonColor: "#DD6B55",
	  confirmButtonText: "Yes, delete it!",
	  cancelButtonText: "No, cancel it!",
	  closeOnConfirm: false,
	  closeOnCancel: false,
	  showLoaderOnConfirm: true,
	},
	function(isConfirm){
	  if (isConfirm) {
		window.setTimeout(function(){
			var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;

		  	$.ajax({
		  		url: '/info/delete/' + id,
		  		type: 'POST',
		  		data: data,
		  		success: function(d)
		  		{
		    		$('table tr#row-' + id).remove();
		    		return swal("Deleted!", "Information successfully deleted!", "success");
		  		},
		  		error: function(d)
		  		{
		    		return swal("Failed!", "Something went wrong!", "error");
		  		}
		  	});
		},2000);
	  } else {
	    swal("Cancelled", "Information is safe.", "error");
	  }
	});
}

function editInfo(id)
{
	return window.location.href = '/info/edit/' + id;
}

function publishInfo(id)
{
	var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/info/publish/' + id,
		type: 'POST',
		data: data,
		success: function(d){
			return window.location.href = d;
		},
		error: function(d){
			return swal('Whoops!', 'Something went wrong', 'error');
		}
	});
}

function unpublishInfo(id)
{
	var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/info/publish/' + id,
		type: 'POST',
		data: data,
		success: function(d){
			return window.location.href = d;
		},
		error: function(d){
			return swal('Whoops!', 'Something went wrong', 'error');
		}
	});
}

function reedem()
{
	$('#reedem').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();
		$.ajax({
			url: '/reedem',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('div#gift-result').html('');
			},
			success: function(d){
				return $('div#gift-result').append('<div class="alert alert-success">' + d.message + '</div>');
			},
			error: function(d){;
				if(d.responseJSON.message == 'used')
				{
					return $('div#gift-result').append('<div class="alert alert-danger">Looks like your gift code isn\'t Valid or has been used.</div>');
				}

				return showNotification('error', 'Whoops something went wrong');
			}
		});
	})
}

function changeSSHDetails(id)
{
	$('#sshAccountEdit').modal('show');

	var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/ssh/edit/' + id,
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#ssh-edit-body').html('');
			$('#ssh-edit-body').append('<div id="please-wait" class="text-center"><h4>PLEASE WAIT...</h4></div>');
		},
		success: function(response){
			window.setTimeout(function(){
				$('#ssh-edit-body').append($(response).hide().fadeIn('slow'));
			},3000);
			$('#please-wait').fadeOut(3000);
		},
		error: function(response){
			window.setTimeout(function(){
				$('#ssh-edit-body').append('<div class="alert alert-danger">Whoops! Something went wrong.</div>');
			},1000);
			$('#please-wait').hide(1000);
		}
	});

}

function editSSH()
{
	$('#edit-ssh').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();
		$.ajax({
			url: '/ssh/edit',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-edit-ssh').attr('disabled', true);
				$('#btn-edit-ssh').text('PLEASE WAIT...');
			},
			success: function(d){
				$('#sshAccountEdit').modal('hide');
				$('#btn-edit-ssh').attr('disabled', false);
				$('#btn-edit-ssh').text('EDIT');
				return showNotification('success', 'Account details successfully changed!');
			},
			error: function(d){
				$('#btn-edit-ssh').attr('disabled', false);
				$('#btn-edit-ssh').text('EDIT');
				return showNotification('error', 'Whoops! Something went wrong!');
			}
		});
	});
}

function changeSSHActive(id)
{
	$('#sshAccountActiveEdit').modal('show');

	var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/ssh/editactive/' + id,
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#ssh-active-edit-body').html('');
			$('#ssh-active-edit-body').append('<div id="please-wait" class="text-center"><h4>PLEASE WAIT...</h4></div>');
		},
		success: function(response){
			window.setTimeout(function(){
				$('#ssh-active-edit-body').append($(response).hide().fadeIn('slow'));
			},3000);
			$('#please-wait').fadeOut(3000);
		},
		error: function(response){
			window.setTimeout(function(){
				$('#ssh-active-edit-body').append('<div class="alert alert-danger">Whoops! Something went wrong.</div>');
			},1000);
			$('#please-wait').hide(1000);
		}
	});

}

function changeSSHActiveDate()
{
	$('#ssh-active').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();
		$.ajax({
			url: '/ssh/editactive',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-change-ssh-active').attr('disabled', true);
				$('#btn-change-ssh-active').text('PLEASE WAIT...');
			},
			success: function(d){
				$('#sshAccountEdit').modal('hide');
				$('#btn-change-ssh-active').attr('disabled', false);
				$('#btn-change-ssh-active').text('EDIT');
				return showNotification('success', 'Active date successfully changed!');
			},
			error: function(d){
				$('#btn-edit-ssh').attr('disabled', false);
				$('#btn-edit-ssh').text('EDIT');
				return showNotification('error', 'Whoops! Something went wrong!');
			}
		});
	});
}

//------------------------------------------------


function changeVPNDetails(id)
{
	$('#vpnAccountEdit').modal('show');

	var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/vpn/edit/' + id,
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#vpn-edit-body').html('');
			$('#vpn-edit-body').append('<div id="please-wait" class="text-center"><h4>PLEASE WAIT...</h4></div>');
		},
		success: function(response){
			window.setTimeout(function(){
				$('#vpn-edit-body').append($(response).hide().fadeIn('slow'));
			},3000);
			$('#please-wait').fadeOut(3000);
		},
		error: function(response){
			window.setTimeout(function(){
				$('#vpn-edit-body').append('<div class="alert alert-danger">Whoops! Something went wrong.</div>');
			},1000);
			$('#please-wait').hide(1000);
		}
	});

}

function editVPN()
{
	$('#edit-vpn').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();
		$.ajax({
			url: '/vpn/edit',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-edit-vpn').attr('disabled', true);
				$('#btn-edit-vpn').text('PLEASE WAIT...');
			},
			success: function(d){
				$('#vpnAccountEdit').modal('hide');
				$('#btn-edit-vpn').attr('disabled', false);
				$('#btn-edit-vpn').text('EDIT');
				return showNotification('success', 'Account details successfully changed!');
			},
			error: function(d){
				$('#btn-edit-vpn').attr('disabled', false);
				$('#btn-edit-vpn').text('EDIT');
				return showNotification('error', 'Whoops! Something went wrong!');
			}
		});
	});
}

function changeVPNActive(id)
{
	$('#vpnAccountActiveEdit').modal('show');

	var data = '_token=' + $('meta[name="csrf-token"]').attr('content');;
	$.ajax({
		url: '/vpn/editactive/' + id,
		type: 'POST',
		data: data,
		beforeSend: function(){
			$('#vpn-active-edit-body').html('');
			$('#vpn-active-edit-body').append('<div id="please-wait" class="text-center"><h4>PLEASE WAIT...</h4></div>');
		},
		success: function(response){
			window.setTimeout(function(){
				$('#vpn-active-edit-body').append($(response).hide().fadeIn('slow'));
			},3000);
			$('#please-wait').fadeOut(3000);
		},
		error: function(response){
			window.setTimeout(function(){
				$('#vpn-active-edit-body').append('<div class="alert alert-danger">Whoops! Something went wrong.</div>');
			},1000);
			$('#please-wait').hide(1000);
		}
	});

}

function changeVPNActiveDate()
{
	$('#vpn-active').submit(function(e){
		e.preventDefault();
		e.stopImmediatePropagation();

		var data = $(this).serialize();
		$.ajax({
			url: '/vpn/editactive',
			type: 'POST',
			data: data,
			beforeSend: function(){
				$('#btn-change-vpn-active').attr('disabled', true);
				$('#btn-change-vpn-active').text('PLEASE WAIT...');
			},
			success: function(d){
				$('#vpnAccountEdit').modal('hide');
				$('#btn-change-vpn-active').attr('disabled', false);
				$('#btn-change-vpn-active').text('EDIT');
				return showNotification('success', 'Active date successfully changed!');
			},
			error: function(d){
				$('#btn-edit-vpn').attr('disabled', false);
				$('#btn-edit-vpn').text('EDIT');
				return showNotification('error', 'Whoops! Something went wrong!');
			}
		});
	});
}

//------------------------------------------------

function showNotification(type,title = '',message)
{
	toastr.remove();
	
	Command: toastr[type](title,message)
	toastr.options = {
	  "closeButton": true,
	  "debug": false,
	  "newestOnTop": true,
	  "progressBar": true,
	  "positionClass": "toast-bottom-full-width",
	  "preventDuplicates": false,
	  "onclick": null,
	  "showDuration": "300",
	  "hideDuration": "1000",
	  "timeOut": "5000",
	  "extendedTimeOut": "1000",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}
}
