# Edvise UI refactor plan

## What’s in good shape

- **Inertia + React** — Set up in a normal way: `HandleInertiaRequests` shares `inst_id`, flash, etc.; pages use `usePage()` and receive props.
- **Ziggy** — Used for `route()` in JS so URLs stay in sync with Laravel route names.
- **Shared middleware** — Applied via `array_filter([...])` so the same auth + terms + optional verification stack is reused.
- **Backend proxy** — Single pattern: `constructInstRequest` + token + `inst_id` is a clear, consistent way to talk to the Python API.

---

## Where it diverges from common Laravel/Inertia practice

### 1. One giant ApiController (~1,350 lines)

Almost all backend-proxy and “API” behavior lives in a single controller. In typical Laravel apps you’d split by domain, e.g.:

- **DashboardController** — dashboard, models list, etc.
- **ModelRunController** or **TrainingController** — model runs, run details, feature importance, ROC, confusion matrix, model cards, etc.
- **InferenceController** — run inference, top features, support overview, etc.
- **FileController** — upload/download, output files, etc.

That would make it much easier to follow “what talks to the backend for training vs inference vs files” and to test.

### 2. Route definitions: mix of closures and controller

`web.php` uses a lot of inline closures, e.g.:

```php
Route::get('/file-upload', function () {
    return Inertia::render('FileUpload');
})->name('file-upload');
```

Standard Laravel style is to point at a controller method:

```php
Route::get('/file-upload', [FileUploadController::class, 'show'])->name('file-upload');
Route::get('/model-results-overview/...', [ModelResultsController::class, 'show'])->name('model-results-overview');
```

That keeps routing as a thin “URL → controller” map and keeps “what data does this page get?” in one place (the controller).

### 3. Repeated middleware blocks

The same `array_filter(['auth', 'terms.accepted', ...])` is pasted on many routes. More usual is a single named middleware group in `bootstrap/app.php` or `Kernel` and then:

```php
Route::middleware('auth.app')->group(function () {
    // all these routes
});
```

So you define “auth + terms + optional verified” once and reuse the name. Clearer and DRY.

**Status:** ✅ Done — `auth.app` and `auth.app.invite` groups added in `Kernel`; `verified` required in all environments for parity. Routes in `web.php` now use these groups.

### 4. Logic in web.php

`get-model-run-id-by-job` and `get-model-run-id` were implemented as route closures that use `Job::find()`, `env()`, etc. In a typical Laravel app that lives in a controller (or a small “BackendProxy” or “ModelRunResolver” service) and the route just calls that. Same for the model-results-overview closure: move the “which props to pass” logic into a controller so `web.php` stays a routing table only.

**Status:** ✅ Done — `ModelResultsOverviewController` and `ModelRunIdController` now hold this logic.

### 5. Frontend: many useEffect + axios per page

In ModelResultsOverview (and similar pages) you have several independent `useEffect` hooks that each call `axios.get(...)` for run details, model_run_id, features, etc. That’s valid but:

- **Standard Inertia approach:** The server (Laravel) loads all data needed for the page and passes it as props. The page then just renders; no (or minimal) client-side fetching. That makes the “what does this page need?” contract obvious on the server and avoids loading states and duplication.
- If you keep client fetching, consider a small data layer (e.g. a `useModelRunDetails(runId, modelName)` hook or a single “page API” that returns one DTO) so the page doesn’t orchestrate many raw axios calls.

### 6. route in JS: global vs import

Some components use `const route = window.route;`, others `import route from 'ziggy-js'`. Using one approach (e.g. always `import route from 'ziggy-js'` and ensuring Ziggy is in the app bootstrap) is clearer and avoids “where does route come from?” confusion.

### 7. Console logging and dead code

There are `console.log`s in production code (e.g. ModelResultsOverview) and commented-out blocks (e.g. `isLocalRequest()`). Removing or gating logs and deleting dead code helps clarity and matches “concise, clear” goals.

### 8. Duplicated backend URL building

Backend path strings like `'/institutions/'.$inst_id.'/training/...'` are built in many controller methods. A small `BackendUrl` or `PythonApi` helper (e.g. `BackendUrl::trainingModelCards($instId, $modelRunId)`) would give one place for the backend contract and keep controllers DRY.

---

## Recommendations (clarity, concise, DRY)

1. **Split ApiController** into 3–5 controllers by feature (dashboard, model runs/training, inference, files, etc.) so each file has a single, obvious responsibility.
2. **Introduce a single auth middleware group** (e.g. `auth.app`) and use `Route::middleware('auth.app')->group(...)` for all app routes that share the same stack.
3. **Move route closures into controllers** (e.g. `ModelResultsOverviewController@show`, `FileUploadController@show`) and move `get-model-run-id-by-job` (and similar) into a controller or a tiny service used by that controller. ✅ Partially done.
4. **Prefer server-side data for Inertia pages:** For model results overview, have the controller (or a service) load run details, model_run_id, and anything else the page needs, and pass them as props. The page then mostly renders; reduce ad-hoc `useEffect` + axios where possible.
5. **Centralize backend URL building** in one helper or config (and use it in the new controllers) so path construction and backend “contract” live in one place.
6. **Use Ziggy consistently in JS** (single import pattern) and remove or gate `console.log` and commented-out code.
7. **Optionally add a single “API client” on the frontend** (e.g. a small module that wraps axios and uses your Laravel routes or a base URL) so components don’t scatter `/institutions/...` and similar strings. You’ve already started this with `trainingUrls.js`; extending that pattern for other backend-backed URLs would align with DRY and clarity.

---

## Summary

The stack (Laravel + Inertia + React + Ziggy) and the overall idea of “Laravel proxies to Python API and shares inst_id” are sound. The main gaps are: one oversized controller, logic and duplication in routes, heavy client-side fetching where server-side props would be clearer, and scattered backend URL construction. Addressing those (split controllers, middleware group, move logic out of routes, server-side page data, one place for backend URLs) would make the codebase much easier to follow and more in line with standard Laravel and Inertia patterns while keeping things clear and DRY.
