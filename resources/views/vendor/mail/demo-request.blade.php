@component('mail::message')
    # New Demo Request

    A new demo request has been submitted through the SST website.

    **Name:** {{ $formData['name'] }}
    **Email:** {{ $formData['email'] }}
    **Institution:** {{ $formData['institution'] }}
    **Title:** {{ $formData['title'] }}

    Please respond to this request within two business days.

    Thanks,<br>
    {{ config('app.name') }}
@endcomponent
