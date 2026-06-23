import pytest
import os
import json
from unittest.mock import patch, MagicMock
from app import app, CSV_PATH, CACHE_FILE, fetch_downloads_count, clean_html_tags

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_clean_html_tags():
    assert clean_html_tags("<p>Hello <b>World</b></p>") == "Hello World"
    assert clean_html_tags("   leading and trailing   ") == "leading and trailing"
    assert clean_html_tags("") == ""
    assert clean_html_tags(None) == ""

@patch('urllib.request.urlopen')
def test_fetch_downloads_count(mock_urlopen):
    # Mocking standard CRANlogs list output
    mock_response = MagicMock()
    mock_response.read.return_value = b'[{"start":"2026-05-23","end":"2026-06-21","downloads":1234,"package":"smacof"}]'
    mock_urlopen.return_value.__enter__.return_value = mock_response

    dls = fetch_downloads_count("smacof")
    assert dls == 1234

def test_index_route(client):
    response = client.get('/')
    assert response.status_code == 200
    assert b"MDS" in response.data or b"Escalado" in response.data

def test_get_packages(client):
    response = client.get('/api/packages')
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))
    assert data['success'] is True
    assert isinstance(data['packages'], list)

def test_tweets_endpoints(client):
    # Get current tweets
    response = client.get('/api/tweets')
    assert response.status_code == 200
    tweets_data = json.loads(response.data.decode('utf-8'))
    assert tweets_data['success'] is True

    # Post new mock tweet
    payload = {
        "package_name": "smacof",
        "text": "Check out the new smacof updates!"
    }
    post_response = client.post('/api/tweet', 
                                data=json.dumps(payload),
                                content_type='application/json')
    assert post_response.status_code == 200
    post_data = json.loads(post_response.data.decode('utf-8'))
    assert post_data['success'] is True
    assert post_data['tweet']['package_name'] == "smacof"

def test_run_mds_invalid(client):
    # Missing parameters
    response = client.post('/api/run-mds', 
                           data=json.dumps({}),
                           content_type='application/json')
    assert response.status_code == 400

    # Invalid type
    response = client.post('/api/run-mds', 
                           data=json.dumps({"type": "invalid_type", "ndim": 2}),
                           content_type='application/json')
    assert response.status_code == 400

    # Invalid ndim
    response = client.post('/api/run-mds', 
                           data=json.dumps({"type": "ratio", "ndim": 5}),
                           content_type='application/json')
    assert response.status_code == 400

def test_run_mds_execution(client):
    # Test execution with eurodist built-in dataset
    payload = {
        "dataset": "eurodist",
        "type": "ratio",
        "ndim": 2
    }
    response = client.post('/api/run-mds',
                           data=json.dumps(payload),
                           content_type='application/json')
    assert response.status_code == 200
    data = json.loads(response.data.decode('utf-8'))
    assert data['success'] is True
    assert 'stress' in data
    assert 'points' in data
    assert len(data['points']) == 21  # 21 European cities in eurodist
