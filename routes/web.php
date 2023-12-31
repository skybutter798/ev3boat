<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;
use App\Http\Controllers\HashController;
use App\Http\Controllers\AuthController;  // Import the AuthController

Route::get('/game', [GameController::class, 'index']);

Route::post('/checkGrid', [GameController::class, 'checkGrid']);

// Use the array syntax for AuthController routes
Route::get('login/twitter', [AuthController::class, 'redirectToTwitter'])->name('login.twitter');
Route::get('login/twitter/callback', [AuthController::class, 'handleTwitterCallback']);
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
Route::post('/wallet', [GameController::class, 'saveWalletAddress'])->middleware('auth');
Route::post('/updateStatus', [GameController::class, 'updateStatus']);
Route::post('/recordReward', [GameController::class, 'recordReward']);
Route::get('/checkWinStatus', [GameController::class, 'checkWinStatus']);
Route::get('/clicked-users', [GameController::class, 'getClickedUsers']);
Route::get('/cash', [GameController::class, 'checkUserForPopout']);
Route::get('/reward-users', [GameController::class, 'getRewardUsers']);

Route::get('/', [HashController::class, 'index']);
Route::post('/hit', [HashController::class, 'handleButtonClick']);
//Route::get('/hash', [HashController::class, 'getLatestBlockHash']);
Route::get('/get-user-entries', [HashController::class, 'getUserEntries']);
Route::get('/shop-items', [HashController::class, 'getShopItems']);
Route::post('/purchase-item', [HashController::class, 'purchaseItem']);
Route::get('/past-hashes', [HashController::class, 'getPastHashes']);
Route::get('/user-info', [HashController::class, 'getUserInfo'])->middleware('auth');
Route::get('/get-all-entries', [HashController::class, 'getAllEntries']);
Route::post('/stone', [HashController::class, 'stone']);
Route::post('/recordReward', [HashController::class, 'recordReward']);
Route::get('/checkWinStatus', [HashController::class, 'checkWinStatus']);
Route::post('/redeem-code', [HashController::class, 'redeem']);
