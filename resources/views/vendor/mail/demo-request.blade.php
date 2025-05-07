@component('mail::message')
    # New Demo Request

    A new demo request has been submitted through the SST website.

    **Name:** {{ $formData['name'] }}
    **Email:** {{ $formData['email'] }}
    **Institution:** {{ $formData['institution'] }}

    **Interests:**
    @if(isset($formData['focus']) && is_array($formData['focus']))
    @foreach($formData['focus'] as $interest)
    - {{ $interest }}
    @endforeach
    @else
    - No specific interests selected
    @endif

    Please respond to this request within two business days.

    Thanks,<br>
    {{ config('app.name') }}
@endcomponent
