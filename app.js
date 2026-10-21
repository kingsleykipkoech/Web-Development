document.addEventListener('DOMContentLoaded', () => {
    initWireSimulation();
    initVerbSelector();
    initStatusCodeInspector();
    initUrlBlueprint();
    initCaseStudies();
    initPlayground();
});

function initWireSimulation() {
    const btn = document.getElementById('btn-run-wire');
    const packet = document.getElementById('active-packet');
    const label = document.getElementById('packet-label');
    const wireStatus = document.getElementById('wire-status-text');
    const cycleDesc = document.getElementById('cycle-step-desc');
    const clientNode = document.getElementById('node-client');
    const serverNode = document.getElementById('node-server');

    if (!btn || !packet) return;

    let isRunning = false;

    btn.addEventListener('click', () => {
        if (isRunning) return;
        isRunning = true;
        btn.disabled = true;

        clientNode.style.borderColor = 'var(--accent-blue)';
        serverNode.style.borderColor = 'var(--border-subtle)';
        label.textContent = 'HTTP GET';
        packet.style.borderColor = 'var(--accent-blue)';
        packet.style.color = 'var(--accent-blue)';
        wireStatus.textContent = 'Step 1 of 4: Client constructing TCP packet...';
        cycleDesc.textContent = 'Client serializes request line (GET /apod), Host header, and opens TCP socket connection.';

        setTimeout(() => {
            packet.classList.add('moving-forward');
            wireStatus.textContent = 'Step 2 of 4: Packet traversing network wire to remote server...';
            cycleDesc.textContent = 'Bits routed across internet switches and gateways toward target IP address.';
        }, 400);

        setTimeout(() => {
            clientNode.style.borderColor = 'var(--border-subtle)';
            serverNode.style.borderColor = 'var(--accent-green)';
            packet.classList.remove('moving-forward');
            packet.style.left = 'calc(100% - 110px)';
            label.textContent = 'HTTP 200 OK';
            packet.style.borderColor = 'var(--accent-green)';
            packet.style.color = 'var(--accent-green)';
            wireStatus.textContent = 'Step 3 of 4: Server parsing headers and executing handler...';
            cycleDesc.textContent = 'Server verifies route, fetches requested resource, and formats HTTP response stream.';
        }, 1600);

        setTimeout(() => {
            packet.classList.add('moving-backward');
            wireStatus.textContent = 'Step 4 of 4: Response packet returning over physical wire...';
            cycleDesc.textContent = 'Response headers and body payload streaming back to client socket.';
        }, 2600);

        setTimeout(() => {
            serverNode.style.borderColor = 'var(--border-subtle)';
            clientNode.style.borderColor = 'var(--accent-green)';
            packet.classList.remove('moving-backward');
            packet.style.left = '0%';
            label.textContent = 'HTTP GET';
            packet.style.borderColor = 'var(--accent-blue)';
            packet.style.color = 'var(--accent-blue)';
            wireStatus.textContent = 'Cycle Complete: 200 OK received and loaded into memory.';
            cycleDesc.textContent = 'Python requests library deserializes bytes into response.status_code and response.json().';
            btn.disabled = false;
            isRunning = false;
        }, 3800);
    });
}

function initVerbSelector() {
    const buttons = document.querySelectorAll('.verb-btn');
    const dispVerb = document.getElementById('disp-verb');
    const dispPath = document.getElementById('disp-path');
    const previewHeaders = document.getElementById('preview-headers');
    const previewBody = document.getElementById('preview-body');
    const dispBodyTitle = document.getElementById('disp-body-title');
    const panelTitle = document.getElementById('panel-verb-title');
    const panelDesc = document.getElementById('panel-verb-desc');
    const matBody = document.getElementById('mat-body');
    const matSafe = document.getElementById('mat-safe');
    const matIdem = document.getElementById('mat-idem');
    const matCache = document.getElementById('mat-cache');

    const verbData = {
        GET: {
            path: '/r/python/about.json',
            headers: 'Host: www.reddit.com\nUser-Agent: python:subreddit.assignment:v1.0\nAccept: application/json\nConnection: close',
            body: '<span class="syntax-comment">[EMPTY FOR GET REQUESTS - GET ONLY READS DATA]</span>',
            bodyTitle: 'Body / Content (Payload Data)',
            title: 'HTTP GET Method',
            desc: 'The GET method requests a representation of the specified resource. Requests using GET should only retrieve data and must never alter server state.',
            hasBody: 'No',
            safe: 'Yes',
            idem: 'Yes',
            cache: 'Yes'
        },
        POST: {
            path: '/api/v1/posts',
            headers: 'Host: api.example.com\nContent-Type: application/json\nContent-Length: 72\nAuthorization: Bearer sec_tok_998',
            body: '{\n  "title": "Introduction to REST APIs",\n  "author": "kingsleykipkoech"\n}',
            bodyTitle: 'Body / Content (Required Data to Create Resource)',
            title: 'HTTP POST Method',
            desc: 'The POST method submits an entity to the specified resource, often causing a change in state or side effects on the server (creating records).',
            hasBody: 'Yes',
            safe: 'No',
            idem: 'No',
            cache: 'No'
        },
        PUT: {
            path: '/api/v1/posts/42',
            headers: 'Host: api.example.com\nContent-Type: application/json\nContent-Length: 68\nAuthorization: Bearer sec_tok_998',
            body: '{\n  "id": 42,\n  "title": "Updated REST Architecture Guide"\n}',
            bodyTitle: 'Body / Content (Complete Replacement Payload)',
            title: 'HTTP PUT Method',
            desc: 'The PUT method completely replaces all current representations of the target resource with the uploaded payload. It is idempotent.',
            hasBody: 'Yes',
            safe: 'No',
            idem: 'Yes',
            cache: 'No'
        },
        DELETE: {
            path: '/api/v1/posts/42',
            headers: 'Host: api.example.com\nAuthorization: Bearer sec_tok_998\nConnection: close',
            body: '<span class="syntax-comment">[EMPTY FOR DELETE REQUESTS - RESOURCE IDENTIFIED BY URL PATH]</span>',
            bodyTitle: 'Body / Content (Empty)',
            title: 'HTTP DELETE Method',
            desc: 'The DELETE method deletes the specified resource. Repeating the exact same DELETE call will yield the same outcome (resource is gone).',
            hasBody: 'No',
            safe: 'No',
            idem: 'Yes',
            cache: 'No'
        }
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const verb = btn.getAttribute('data-verb');
            const data = verbData[verb];

            dispVerb.textContent = verb;
            dispPath.textContent = data.path;
            previewHeaders.textContent = data.headers;
            previewBody.innerHTML = data.body;
            dispBodyTitle.textContent = data.bodyTitle;
            panelTitle.textContent = data.title;
            panelDesc.textContent = data.desc;

            updateMatrixVal(matBody, data.hasBody);
            updateMatrixVal(matSafe, data.safe);
            updateMatrixVal(matIdem, data.idem);
            updateMatrixVal(matCache, data.cache);
        });
    });

    function updateMatrixVal(element, val) {
        element.textContent = val;
        if (val === 'Yes') {
            element.className = 'matrix-val val-yes';
        } else {
            element.className = 'matrix-val val-no';
        }
    }
}

function initStatusCodeInspector() {
    const cards = document.querySelectorAll('.status-badge-card');
    const label = document.getElementById('selected-code-label');
    const badge = document.getElementById('selected-type-badge');
    const preview = document.getElementById('preview-response-packet');

    const codeData = {
        '200': {
            label: 'HTTP/1.1 200 OK',
            type: '2xx SUCCESS',
            badgeClass: 'badge-green',
            packet: 'HTTP/1.1 200 OK\nDate: Wed, 21 Oct 2026 03:00:00 GMT\nServer: gunicorn / nginx\nContent-Type: application/json; charset=utf-8\nContent-Length: 384\n\n{\n  "title": "NGC 5139 Globular Cluster",\n  "media_type": "image",\n  "hdurl": "https://assets.science.nasa.gov/.../NGC5139.jpg"\n}'
        },
        '201': {
            label: 'HTTP/1.1 201 Created',
            type: '2xx SUCCESS',
            badgeClass: 'badge-green',
            packet: 'HTTP/1.1 201 Created\nDate: Wed, 21 Oct 2026 03:00:01 GMT\nServer: envoy\nLocation: /api/v1/posts/42\nContent-Type: application/json; charset=utf-8\n\n{\n  "id": 42,\n  "status": "resource_persisted",\n  "created_at": "2026-10-21T03:00:01Z"\n}'
        },
        '301': {
            label: 'HTTP/1.1 301 Moved Permanently',
            type: '3xx REDIRECTION',
            badgeClass: 'badge-amber',
            packet: 'HTTP/1.1 301 Moved Permanently\nDate: Wed, 21 Oct 2026 03:00:02 GMT\nServer: cloudflare\nLocation: https://science.nasa.gov/wp-json/wp/v2/apod-basic/\nContent-Length: 0\n\n[Body empty. Client HTTP library automatically follows Location URL]'
        },
        '401': {
            label: 'HTTP/1.1 401 Unauthorized',
            type: '4xx CLIENT ERROR',
            badgeClass: 'badge-amber',
            packet: 'HTTP/1.1 401 Unauthorized\nDate: Wed, 21 Oct 2026 03:00:03 GMT\nWWW-Authenticate: Bearer realm="API Access"\nContent-Type: application/json\n\n{\n  "error": "unauthorized",\n  "message": "Missing required API key parameter or authorization header."\n}'
        },
        '403': {
            label: 'HTTP/1.1 403 Forbidden',
            type: '4xx CLIENT ERROR',
            badgeClass: 'badge-amber',
            packet: 'HTTP/1.1 403 Forbidden\nDate: Wed, 21 Oct 2026 03:00:04 GMT\nServer: reddit-gateway\nContent-Type: application/json\n\n{\n  "message": "Blocked: Default python-requests User-Agent detected.",\n  "error": 403\n}\n\nFix: Set custom User-Agent header matching your script name and identity.'
        },
        '404': {
            label: 'HTTP/1.1 404 Not Found',
            type: '4xx CLIENT ERROR',
            badgeClass: 'badge-amber',
            packet: 'HTTP/1.1 404 Not Found\nDate: Wed, 21 Oct 2026 03:00:05 GMT\nServer: nginx\nContent-Type: application/json\n\n{\n  "error": "not_found",\n  "message": "The requested resource URI does not exist on this server."\n}'
        },
        '500': {
            label: 'HTTP/1.1 500 Internal Server Error',
            type: '5xx SERVER ERROR',
            badgeClass: 'badge-purple',
            packet: 'HTTP/1.1 500 Internal Server Error\nDate: Wed, 21 Oct 2026 03:00:06 GMT\nServer: gunicorn\nContent-Type: text/plain\n\nTraceback (most recent call last):\n  File "server.py", line 84, in handle_request\n    database_pool.acquire()\nDatabaseTimeout: Connection pool exhausted.'
        }
    };

    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');

            const code = card.getAttribute('data-code');
            const data = codeData[code];

            label.textContent = data.label;
            badge.textContent = data.type;
            badge.className = 'tag-badge ' + data.badgeClass;
            preview.textContent = data.packet;
        });
    });
}

function initUrlBlueprint() {
    const blocks = document.querySelectorAll('.url-part-box');
    const infoBox = document.getElementById('url-info-box');

    blocks.forEach(block => {
        const text = block.getAttribute('data-info');
        block.addEventListener('mouseenter', () => {
            infoBox.textContent = text;
        });
        block.addEventListener('click', () => {
            infoBox.textContent = text;
        });
    });
}

function initCaseStudies() {
    const tabs = document.querySelectorAll('.case-tab');
    const container = document.getElementById('case-view');

    const cases = {
        nasa: `
            <div class="code-preview" style="font-size: 0.88rem; line-height: 1.6;">
# NASA SCRIPT ARCHITECTURE BREAKDOWN
import requests

url = "https://science.nasa.gov/wp-json/wp/v2/apod-basic/"
response = requests.get(url)

# 1. VERIFY STATUS CODE (Rule from Slide 14)
if response.status_code == 200:
    data = response.json()
    image_url = data[0]["attachment_url"]

    # 2. STREAM BINARY DATA OVER THE WIRE
    img_response = requests.get(image_url)
    if img_response.status_code == 200:
        # response.content contains raw binary bytes, NOT string text
        with open("nasa_today.jpg", "wb") as f:
            f.write(img_response.content)
            </div>
            <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                <strong>Key Architectural Insight:</strong> APIs return both serialized structured text (JSON via <code>response.json()</code>) and binary stream buffers (JPEG via <code>response.content</code>). Writing in <code>"wb"</code> mode preserves the byte format without corruption.
            </div>
        `,
        reddit: `
            <div class="code-preview" style="font-size: 0.88rem; line-height: 1.6;">
# REDDIT EXPLORER ARCHITECTURE BREAKDOWN
import requests

url = "https://www.reddit.com/r/python/about.json"

# 1. METADATA HEADERS PREVENT 403 FORBIDDEN
headers = {
    "User-Agent": "python:subreddit.fetcher:v1.0 (by /u/kingsleykipkoech)"
}

response = requests.get(url, headers=headers)

# 2. STATUS VERIFICATION & DICTIONARY TRAVERSAL
if response.status_code == 200:
    data = response.json()
    sub_data = data.get("data", {})
    subscribers = sub_data.get("subscribers", 0)
    print("Subscribers:", subscribers)
else:
    print("Request failed with status code:", response.status_code)
            </div>
            <div style="margin-top: 1rem; color: var(--text-secondary); font-size: 0.9rem;">
                <strong>Key Architectural Insight:</strong> Reddit blocks generic scraping clients. Passing an explicit <code>User-Agent</code> header satisfies server rate-limiting and authorization requirements.
            </div>
        `
    };

    container.innerHTML = cases.nasa;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.getAttribute('data-case');
            container.innerHTML = cases[target];
        });
    });
}

function initPlayground() {
    const selector = document.getElementById('preset-selector');
    const inputUrl = document.getElementById('play-url');
    const inputHeaders = document.getElementById('play-headers');
    const groupBody = document.getElementById('group-play-body');
    const inputBody = document.getElementById('play-body');
    const btnFire = document.getElementById('btn-fire-play');
    const pill = document.getElementById('play-status-pill');
    const output = document.getElementById('play-response-out');

    const presets = {
        'nasa': {
            url: 'https://science.nasa.gov/wp-json/wp/v2/apod-basic/',
            headers: 'Host: science.nasa.gov\nUser-Agent: python-requests/2.31.0\nAccept: application/json',
            body: '',
            hasBody: false,
            responseStatus: '200 OK',
            response: 'HTTP/1.1 200 OK\nDate: Wed, 21 Oct 2026 03:00:10 GMT\nContent-Type: application/json; charset=UTF-8\nServer: nginx\nTransfer-Encoding: chunked\n\n[\n  {\n    "id": 142901,\n    "title": "The Tarantula Nebula in Super Resolution",\n    "date": "2026-10-21",\n    "attachment_url": "https://assets.science.nasa.gov/media/apod/tarantula.jpg",\n    "media_type": "image"\n  }\n]'
        },
        'reddit': {
            url: 'https://www.reddit.com/r/python/about.json',
            headers: 'Host: www.reddit.com\nUser-Agent: python:subreddit.assignment:v1.0 (by /u/kingsleykipkoech)\nAccept: application/json',
            body: '',
            hasBody: false,
            responseStatus: '200 OK',
            response: 'HTTP/1.1 200 OK\nDate: Wed, 21 Oct 2026 03:00:11 GMT\nContent-Type: application/json; charset=UTF-8\nServer: snoo\nx-ratelimit-remaining: 598\n\n{\n  "kind": "t5",\n  "data": {\n    "display_name": "Python",\n    "title": "Python News & Discussion",\n    "subscribers": 1284500,\n    "active_user_count": 3410\n  }\n}'
        },
        'post-book': {
            url: 'https://api.library.edu/v1/books',
            headers: 'Host: api.library.edu\nContent-Type: application/json\nAuthorization: Bearer token_alu_session',
            body: '{\n  "title": "Computer Networks: A Systems Approach",\n  "isbn": "978-0123850591",\n  "author": "Peterson & Davie"\n}',
            hasBody: true,
            responseStatus: '201 Created',
            response: 'HTTP/1.1 201 Created\nDate: Wed, 21 Oct 2026 03:00:12 GMT\nLocation: /v1/books/984\nContent-Type: application/json\n\n{\n  "id": 984,\n  "status": "created",\n  "title": "Computer Networks: A Systems Approach",\n  "created_at": "2026-10-21T03:00:12Z"\n}'
        },
        'delete-book': {
            url: 'https://api.library.edu/v1/books/984',
            headers: 'Host: api.library.edu\nAuthorization: Bearer token_alu_session\nConnection: close',
            body: '',
            hasBody: false,
            responseStatus: '204 No Content',
            response: 'HTTP/1.1 204 No Content\nDate: Wed, 21 Oct 2026 03:00:13 GMT\nServer: envoy\nConnection: close\n\n[Body empty. Resource 984 deleted successfully]'
        }
    };

    function applyPreset(key) {
        const item = presets[key];
        inputUrl.value = item.url;
        inputHeaders.value = item.headers;
        if (item.hasBody) {
            groupBody.style.display = 'block';
            inputBody.value = item.body;
        } else {
            groupBody.style.display = 'none';
            inputBody.value = '';
        }
        pill.textContent = 'Ready';
        pill.className = 'tag-badge badge-blue';
        output.textContent = 'Click "Execute HTTP Request" to send packet.';
    }

    applyPreset('nasa');

    selector.addEventListener('change', () => {
        applyPreset(selector.value);
    });

    btnFire.addEventListener('click', () => {
        const key = selector.value;
        const item = presets[key];

        pill.textContent = 'Sending...';
        pill.className = 'tag-badge badge-amber';
        output.textContent = 'Opening TCP connection to ' + inputUrl.value + ' ...\nStreaming request headers...';

        setTimeout(() => {
            pill.textContent = item.responseStatus;
            pill.className = item.responseStatus.startsWith('2') ? 'tag-badge badge-green' : 'tag-badge badge-purple';
            output.textContent = item.response;
        }, 500);
    });
}
