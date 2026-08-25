<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Page not found - {{ config('app.name') }}</title>
    <link rel="icon" type="image/png" href="{{ asset('favicon.ico') }}">
    @vite('resources/css/app.css')
  </head>
  <body class="bg-[#EEF2F6] font-sans antialiased">
    <header class="p-6">
      <a href="{{ url('/') }}">
        <img
          class="h-9"
          src="https://storage.googleapis.com/staging-sst-01-staging-static/edvise-logo.svg"
          alt="Edvise Logo"
        >
      </a>
    </header>
    <main class="bg-white py-20 sm:pb-44">
      <div class="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <h1 class="text-5xl font-light text-black">404 - Page not found</h1>
        <p class="mt-6 mb-8 text-base font-light text-[#4F4F4F]">
          We couldn't find that page. It may have been moved, or the link might be incorrect.
        </p>
        <a class="btn btn-primary" href="{{ url('/') }}">Back to home</a>
      </div>
    </main>
  </body>
</html>
